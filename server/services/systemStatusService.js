const fs = require('fs').promises;

class SystemStatusService {
  constructor() {
    this.statusFilePath = process.env.SYSTEM_STATUS_FILE || '/var/tmp/weekplanner-network-status.json';
    this.watchdogLogPath = process.env.WIFI_WATCHDOG_LOG_FILE || '/var/log/wifi-watchdog.log';
    this.maxLogLines = parseInt(process.env.WIFI_WATCHDOG_LOG_LINES || '200', 10);
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (_error) {
      return false;
    }
  }

  getLastLines(text, maxLines) {
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(-maxLines);
  }

  parseWatchdogLog(lines) {
    const failPattern = /^\[(?<timestamp>[^\]]+)\] FAIL detected: (?<reason>.+)$/;
    const recoveryPattern = /^\[(?<timestamp>[^\]]+)\] RECOVERED: (?<detail>.+)$/;

    let lastFail = null;
    let lastRecovery = null;

    for (const line of lines) {
      const failMatch = line.match(failPattern);
      if (failMatch) {
        lastFail = {
          timestamp: failMatch.groups.timestamp,
          reason: failMatch.groups.reason,
          line
        };
        continue;
      }

      const recoveryMatch = line.match(recoveryPattern);
      if (recoveryMatch) {
        lastRecovery = {
          timestamp: recoveryMatch.groups.timestamp,
          detail: recoveryMatch.groups.detail,
          line
        };
      }
    }

    return { lastFail, lastRecovery };
  }

  buildLogStatus(lines) {
    const { lastFail, lastRecovery } = this.parseWatchdogLog(lines);

    if (!lastFail && !lastRecovery) {
      return {
        status: 'ok',
        source: 'watchdog-log',
        message: null,
        detail: null,
        lastEventAt: null,
        logTail: lines
      };
    }

    if (lastFail && (!lastRecovery || lastFail.timestamp > lastRecovery.timestamp)) {
      return {
        status: 'error',
        source: 'watchdog-log',
        message: 'Wi-Fi eller internet er nede.',
        detail: `Watchdog meldte fejl: ${lastFail.reason}.`,
        lastEventAt: lastFail.timestamp,
        failReason: lastFail.reason,
        logTail: lines
      };
    }

    return {
      status: 'ok',
      source: 'watchdog-log',
      message: null,
      detail: null,
      lastEventAt: lastRecovery ? lastRecovery.timestamp : null,
      recoveryDetail: lastRecovery ? lastRecovery.detail : null,
      logTail: lines
    };
  }

  async readStatusFile() {
    if (!await this.fileExists(this.statusFilePath)) {
      return null;
    }

    try {
      const raw = await fs.readFile(this.statusFilePath, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      return {
        status: 'warning',
        source: 'status-file',
        message: 'Kunne ikke laese watchdog statusfil.',
        detail: error.message
      };
    }
  }

  normalizeStatusFileStatus(statusFile) {
    if (!statusFile) {
      return null;
    }

    if (statusFile.status || statusFile.message) {
      return {
        status: statusFile.status || 'warning',
        source: 'status-file',
        message: statusFile.message || 'Netvaerksstatus er tilgaengelig.',
        detail: statusFile.detail || null,
        lastEventAt: statusFile.timestamp || statusFile.lastUpdated || null,
        failReason: statusFile.failReason || null
      };
    }

    if (statusFile.state === 'fail') {
      return {
        status: 'error',
        source: 'status-file',
        message: 'Wi-Fi eller internet er nede.',
        detail: statusFile.failReason ? `Watchdog meldte fejl: ${statusFile.failReason}.` : 'Watchdog registrerede forbindelsesfejl.',
        lastEventAt: statusFile.timestamp || statusFile.lastUpdated || null,
        failReason: statusFile.failReason || null
      };
    }

    return {
      status: 'ok',
      source: 'status-file',
      message: null,
      detail: null,
      lastEventAt: statusFile.timestamp || statusFile.lastUpdated || null,
      failReason: null
    };
  }

  async getStatus() {
    const statusFile = await this.readStatusFile();
    const normalizedStatusFile = this.normalizeStatusFileStatus(statusFile);

    let logStatus = null;
    if (await this.fileExists(this.watchdogLogPath)) {
      try {
        const logContent = await fs.readFile(this.watchdogLogPath, 'utf8');
        const lines = this.getLastLines(logContent, this.maxLogLines);
        logStatus = this.buildLogStatus(lines);
      } catch (error) {
        logStatus = {
          status: 'warning',
          source: 'watchdog-log',
          message: 'Kunne ikke laese watchdog log.',
          detail: error.message,
          logTail: []
        };
      }
    }

    const chosenStatus = (normalizedStatusFile && normalizedStatusFile.status === 'error')
      ? normalizedStatusFile
      : (logStatus || normalizedStatusFile || {
          status: 'unavailable',
          source: 'none',
          message: 'Ingen watchdog status fundet.',
          detail: 'Opret wifi-watchdog.log eller en statusfil for live netvaerksstatus.'
        });

    return {
      ...chosenStatus,
      statusFilePath: this.statusFilePath,
      watchdogLogPath: this.watchdogLogPath,
      checkedAt: new Date().toISOString(),
      logTail: logStatus && logStatus.logTail ? logStatus.logTail : []
    };
  }
}

module.exports = new SystemStatusService();
