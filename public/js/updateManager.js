/**
 * Update Manager - Handles SSE real-time updates and fallback polling
 */
class UpdateManager {
  constructor(options) {
    this.onCalendarUpdate = options.onCalendarUpdate || (() => {});
    this.onMealUpdate = options.onMealUpdate || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});

    this.eventSource = null;
    this.pollInterval = null;
    this.pollIntervalMs = 5 * 60 * 1000; // 5 minutes fallback
    this.reconnectDelay = 5000; // 5 seconds
    this.maxReconnectDelay = 60000; // 1 minute max
    this.currentReconnectDelay = this.reconnectDelay;
    this.systemStatusIntervalMs = 10 * 1000;
    this.systemStatusInterval = null;

    this.sseState = 'connecting';
    this.calendarFetchError = null;
    this.mealFetchError = null;
    this.calendarSyncStatus = null;
    this.systemStatus = null;

    // Connection status tracking
    this.online = navigator.onLine;
    this.statusGroupEl = null;
    this.statusEl = null;
    this.recoveryCountEl = null;
    this.initStatusIndicator();

    // Listen for browser online/offline events
    window.addEventListener('online', () => this.setOnline(true));
    window.addEventListener('offline', () => this.setOnline(false));
  }

  /**
   * Create connection status indicator in the header
   */
  initStatusIndicator() {
    this.statusGroupEl = document.createElement('div');
    this.statusGroupEl.id = 'connection-status-group';

    this.statusEl = document.createElement('div');
    this.statusEl.id = 'connection-status';

    this.recoveryCountEl = document.createElement('div');
    this.recoveryCountEl.id = 'wifi-recovery-count';
    this.recoveryCountEl.textContent = 'Wi-Fi 0';
    this.recoveryCountEl.title = 'Wi-Fi recoveries since reboot';

    this.statusGroupEl.append(this.statusEl, this.recoveryCountEl);
    this.updateStatusIndicator();

    const timeEl = document.getElementById('current-time');
    if (timeEl && timeEl.parentNode) {
      timeEl.parentNode.insertBefore(this.statusGroupEl, timeEl);
    }
  }

  /**
   * Update the visual connection indicator
   */
  updateStatusIndicator() {
    if (!this.statusEl) return;
    this.statusEl.className = this.online ? 'status-online' : 'status-offline';
    this.statusEl.title = this.online ? 'Forbundet' : 'Ingen forbindelse';
  }

  /**
   * Set connection status
   */
  setOnline(isOnline) {
    this.online = isOnline;
    this.updateStatusIndicator();
  }

  updateRecoveryCount(count) {
    if (!this.recoveryCountEl || !Number.isFinite(count)) {
      return;
    }

    this.recoveryCountEl.textContent = `Wi-Fi ${count}`;
    this.recoveryCountEl.classList.toggle('has-recoveries', count > 0);
  }

  /**
   * Start the update manager
   */
  start() {
    // Connect to SSE
    this.connectSSE();

    // Initial data load
    this.loadAll();
    this.loadSystemStatus();

    // Start fallback polling
    this.startPolling();
    this.startSystemStatusPolling();

    console.log('Update manager started');
  }

  /**
   * Connect to Server-Sent Events endpoint
   */
  connectSSE() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    console.log('Connecting to SSE...');
    this.eventSource = new EventSource('/api/events-stream');

    this.eventSource.onopen = () => {
      console.log('SSE connected');
      this.sseState = 'connected';
      this.currentReconnectDelay = this.reconnectDelay;
      this.emitStatus();
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`SSE message: ${data.type}`);

        switch (data.type) {
          case 'connected':
            console.log('SSE connection confirmed');
            break;
          case 'calendar-update':
            console.log('Calendar update received, refreshing...');
            this.loadCalendar();
            break;
          case 'meal-update':
            console.log('Meal update received, refreshing...');
            this.loadMeals();
            break;
          default:
            console.log('Unknown SSE event type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    this.eventSource.onerror = () => {
      console.warn('SSE connection error, will reconnect...');
      this.sseState = 'disconnected';
      this.eventSource.close();
      this.emitStatus();

      setTimeout(() => {
        this.connectSSE();
      }, this.currentReconnectDelay);

      this.currentReconnectDelay = Math.min(
        this.currentReconnectDelay * 2,
        this.maxReconnectDelay
      );
    };
  }

  /**
   * Start fallback polling
   */
  startPolling() {
    this.pollInterval = setInterval(() => {
      console.log('Polling for updates...');
      this.loadAll();
    }, this.pollIntervalMs);
  }

  startSystemStatusPolling() {
    this.systemStatusInterval = setInterval(() => {
      this.loadSystemStatus();
    }, this.systemStatusIntervalMs);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    if (this.systemStatusInterval) {
      clearInterval(this.systemStatusInterval);
      this.systemStatusInterval = null;
    }
  }

  /**
   * Load calendar data
   */
  async loadCalendar() {
    try {
      const response = await fetch('/api/calendar');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      this.calendarFetchError = null;
      this.calendarSyncStatus = data.syncStatus?.calendar || null;
      this.setOnline(true);
      this.onCalendarUpdate(data);
      this.emitStatus(data.lastUpdated);
    } catch (error) {
      console.error('Error loading calendar:', error);
      this.calendarFetchError = error.message;
      this.setOnline(false);
      this.emitStatus();
    }
  }

  /**
   * Load meal data
   */
  async loadMeals() {
    try {
      const response = await fetch('/api/meals');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      this.mealFetchError = null;
      this.onMealUpdate(data);
      this.emitStatus();
    } catch (error) {
      console.error('Error loading meals:', error);
      this.mealFetchError = error.message;
      this.emitStatus();
    }
  }

  async loadSystemStatus() {
    try {
      const response = await fetch('/api/system-status');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.systemStatus = await response.json();
      this.updateRecoveryCount(this.systemStatus.recoveryCountSinceBoot);
      this.emitStatus();
    } catch (error) {
      console.error('Error loading system status:', error);
      this.systemStatus = {
        status: 'warning',
        source: 'frontend',
        message: 'Systemstatus kunne ikke hentes.',
        detail: 'Skærmen kan ikke laese Pi watchdog status lige nu.'
      };
      this.emitStatus();
    }
  }

  /**
   * Load all data
   */
  async loadAll() {
    await Promise.all([
      this.loadCalendar(),
      this.loadMeals()
    ]);
  }

  /**
   * Stop the update manager
   */
  stop() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.stopPolling();
    console.log('Update manager stopped');
  }

  formatTimestamp(timestamp) {
    if (!timestamp) {
      return null;
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatus(lastUpdated) {
    if (this.systemStatus && this.systemStatus.status === 'error') {
      return {
        level: 'error',
        message: this.systemStatus.message || 'Pi netvaerket har problemer.',
        detail: this.systemStatus.detail || 'Watchdog har registreret en forbindelsesfejl.'
      };
    }

    if (this.systemStatus && this.systemStatus.status === 'warning') {
      return {
        level: 'warning',
        message: this.systemStatus.message || 'Pi status er usikker.',
        detail: this.systemStatus.detail || 'Watchdog status kunne ikke laeses.'
      };
    }

    if (this.calendarFetchError) {
      return {
        level: 'error',
        message: 'Kalenderen kunne ikke hentes.',
        detail: 'Skærmen prøver igen automatisk.'
      };
    }

    if (this.mealFetchError) {
      return {
        level: 'warning',
        message: 'Maddata kunne ikke opdateres.',
        detail: 'Kalenderen fortsætter med de seneste data.'
      };
    }

    if (this.calendarSyncStatus && this.calendarSyncStatus.state === 'warning') {
      const updatedAt = this.formatTimestamp(lastUpdated || this.calendarSyncStatus.lastSuccessAt);
      return {
        level: 'warning',
        message: 'Kalenderforbindelsen driller. Viser gemte data.',
        detail: updatedAt ? `Sidst opdateret kl. ${updatedAt}.` : 'Skærmen prøver igen automatisk.'
      };
    }

    if (this.calendarSyncStatus && this.calendarSyncStatus.state === 'error') {
      const failedAt = this.formatTimestamp(this.calendarSyncStatus.lastErrorAt);
      return {
        level: 'error',
        message: 'Kalenderen kan ikke opdateres lige nu.',
        detail: failedAt ? `Seneste fejl kl. ${failedAt}.` : 'Tjek Pi netværk og Google-forbindelse.'
      };
    }

    if (this.sseState === 'disconnected') {
      return {
        level: 'warning',
        message: 'Direkte opdatering er afbrudt.',
        detail: 'Skærmen prøver at genoprette forbindelsen.'
      };
    }

    return null;
  }

  emitStatus(lastUpdated) {
    this.onStatusChange(this.getStatus(lastUpdated));
  }
}

// Export for use in app.js
window.UpdateManager = UpdateManager;
