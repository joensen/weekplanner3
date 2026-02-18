const axios = require('axios');
const { NodeCache } = require('@cacheable/node-cache');

// 15-minute cache
const cache = new NodeCache({ stdTTL: 900 });

// WMO Weather Code to emoji mapping
const WMO_CODES = {
  0:  { emoji: '☀️', description: 'Klart vejr' },
  1:  { emoji: '🌤️', description: 'Mest klart' },
  2:  { emoji: '⛅', description: 'Delvist skyet' },
  3:  { emoji: '☁️', description: 'Overskyet' },
  45: { emoji: '🌫️', description: 'Tåge' },
  48: { emoji: '🌫️', description: 'Rimtåge' },
  51: { emoji: '🌦️', description: 'Let støvregn' },
  53: { emoji: '🌦️', description: 'Støvregn' },
  55: { emoji: '🌧️', description: 'Kraftig støvregn' },
  56: { emoji: '🌧️', description: 'Frysende støvregn' },
  57: { emoji: '🌧️', description: 'Kraftig frysende støvregn' },
  61: { emoji: '🌧️', description: 'Let regn' },
  63: { emoji: '🌧️', description: 'Regn' },
  65: { emoji: '🌧️', description: 'Kraftig regn' },
  66: { emoji: '🌧️', description: 'Let frysende regn' },
  67: { emoji: '🌧️', description: 'Kraftig frysende regn' },
  71: { emoji: '🌨️', description: 'Let sne' },
  73: { emoji: '🌨️', description: 'Sne' },
  75: { emoji: '❄️', description: 'Kraftig sne' },
  77: { emoji: '❄️', description: 'Snekorn' },
  80: { emoji: '🌦️', description: 'Lette byger' },
  81: { emoji: '🌧️', description: 'Byger' },
  82: { emoji: '🌧️', description: 'Kraftige byger' },
  85: { emoji: '🌨️', description: 'Lette snebyger' },
  86: { emoji: '❄️', description: 'Kraftige snebyger' },
  95: { emoji: '⛈️', description: 'Tordenvejr' },
  96: { emoji: '⛈️', description: 'Tordenvejr med hagl' },
  99: { emoji: '⛈️', description: 'Kraftigt tordenvejr med hagl' }
};

class WeatherService {
  constructor() {
    this.cache = cache;
    this.lat = process.env.WEATHER_LAT || '56.2302';
    this.lon = process.env.WEATHER_LON || '9.7391';
  }

  /**
   * Get current weather data (cached for 15 minutes)
   */
  async getCurrentWeather() {
    const cacheKey = 'current-weather';
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=temperature_2m,weather_code&timezone=Europe/Berlin`;
      const response = await axios.get(url, { timeout: 5000 });

      const current = response.data.current;
      const weatherCode = current.weather_code;
      const wmo = WMO_CODES[weatherCode] || { emoji: '🌡️', description: 'Ukendt' };

      const result = {
        temperature: Math.round(current.temperature_2m),
        weatherCode,
        emoji: wmo.emoji,
        description: wmo.description
      };

      this.cache.set(cacheKey, result);
      console.log(`🌤️ Weather updated: ${result.emoji} ${result.temperature}°C - ${result.description}`);
      return result;
    } catch (error) {
      console.error('Weather API error:', error.message);
      return null;
    }
  }
}

module.exports = new WeatherService();
