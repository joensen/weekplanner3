class StatusBanner {
  constructor() {
    this.element = document.getElementById('system-status');
    this.messageElement = document.getElementById('system-status-message');
    this.detailElement = document.getElementById('system-status-detail');
  }

  setStatus(status) {
    if (!this.element || !this.messageElement || !this.detailElement) {
      return;
    }

    if (!status) {
      this.element.hidden = true;
      this.element.className = 'system-status';
      this.messageElement.textContent = '';
      this.detailElement.textContent = '';
      return;
    }

    this.element.hidden = false;
    this.element.className = `system-status ${status.level || 'warning'}`;
    this.messageElement.textContent = status.message || '';
    this.detailElement.textContent = status.detail || '';
  }
}

window.StatusBanner = StatusBanner;
