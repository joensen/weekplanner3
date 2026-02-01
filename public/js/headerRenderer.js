/**
 * Header Renderer - Displays current date and time
 */
class HeaderRenderer {
  constructor() {
    this.dateEl = document.getElementById('current-date');
    this.timeEl = document.getElementById('current-time');
    this.intervalId = null;
  }

  /**
   * Format date in Danish locale: "Søndag 1. februar 2026"
   */
  formatDate(date) {
    const weekdays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const months = ['januar', 'februar', 'marts', 'april', 'maj', 'juni',
                    'juli', 'august', 'september', 'oktober', 'november', 'december'];

    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${weekday} ${day}. ${month} ${year}`;
  }

  /**
   * Format time in 24-hour format
   */
  formatTime(date) {
    return date.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Update the header display
   */
  update() {
    const now = new Date();
    this.dateEl.textContent = this.formatDate(now);
    this.timeEl.textContent = this.formatTime(now);
  }

  /**
   * Start the header renderer (updates every second)
   */
  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
    console.log('⏰ Header renderer started');
  }

  /**
   * Stop the header renderer
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Export for use in app.js
window.HeaderRenderer = HeaderRenderer;
