/**
 * Weather Renderer - Displays current weather in header
 */
class WeatherRenderer {
  constructor() {
    this.el = document.getElementById('weather');
    this.intervalId = null;
    this.refreshInterval = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Fetch weather data from API
   */
  async fetchWeather() {
    try {
      const response = await fetch('/api/weather');
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  }

  /**
   * Render weather into the header element
   */
  render(data) {
    if (!data || !this.el) {
      if (this.el) this.el.style.display = 'none';
      return;
    }

    this.el.style.display = '';
    this.el.innerHTML = `<span class="weather-icon">${data.emoji}</span><span class="weather-temp">${data.temperature}°</span>`;
  }

  /**
   * Fetch and render weather
   */
  async update() {
    const data = await this.fetchWeather();
    this.render(data);
  }

  /**
   * Start the weather renderer (updates every 15 minutes)
   */
  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), this.refreshInterval);
    console.log('🌤️ Weather renderer started');
  }

  /**
   * Stop the weather renderer
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Export for use in app.js
window.WeatherRenderer = WeatherRenderer;
