const axios = require('axios');
const { NodeCache } = require('@cacheable/node-cache');

// 15-minute cache
const cache = new NodeCache({ stdTTL: 900 });

// WMO Weather Code to emoji mapping (nightEmoji used when is_day=0)
const WMO_CODES = {
  0:  { emoji: '☀️', nightEmoji: '🌙', description: 'Klart vejr' },
  1:  { emoji: '🌤️', nightEmoji: '🌙', description: 'Mest klart' },
  2:  { emoji: '⛅', nightEmoji: '☁️', description: 'Delvist skyet' },
  3:  { emoji: '☁️', nightEmoji: '☁️', description: 'Overskyet' },
  45: { emoji: '🌫️', nightEmoji: '🌫️', description: 'Tåge' },
  48: { emoji: '🌫️', nightEmoji: '🌫️', description: 'Rimtåge' },
  51: { emoji: '🌦️', nightEmoji: '🌧️', description: 'Let støvregn' },
  53: { emoji: '🌦️', nightEmoji: '🌧️', description: 'Støvregn' },
  55: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Kraftig støvregn' },
  56: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Frysende støvregn' },
  57: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Kraftig frysende støvregn' },
  61: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Let regn' },
  63: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Regn' },
  65: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Kraftig regn' },
  66: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Let frysende regn' },
  67: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Kraftig frysende regn' },
  71: { emoji: '🌨️', nightEmoji: '🌨️', description: 'Let sne' },
  73: { emoji: '🌨️', nightEmoji: '🌨️', description: 'Sne' },
  75: { emoji: '❄️', nightEmoji: '❄️', description: 'Kraftig sne' },
  77: { emoji: '❄️', nightEmoji: '❄️', description: 'Snekorn' },
  80: { emoji: '🌦️', nightEmoji: '🌧️', description: 'Lette byger' },
  81: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Byger' },
  82: { emoji: '🌧️', nightEmoji: '🌧️', description: 'Kraftige byger' },
  85: { emoji: '🌨️', nightEmoji: '🌨️', description: 'Lette snebyger' },
  86: { emoji: '❄️', nightEmoji: '❄️', description: 'Kraftige snebyger' },
  95: { emoji: '⛈️', nightEmoji: '⛈️', description: 'Tordenvejr' },
  96: { emoji: '⛈️', nightEmoji: '⛈️', description: 'Tordenvejr med hagl' },
  99: { emoji: '⛈️', nightEmoji: '⛈️', description: 'Kraftigt tordenvejr med hagl' }
};

class WeatherService {
  constructor() {
    this.cache = cache;
    this.lat = process.env.WEATHER_LAT || '56.2302';
    this.lon = process.env.WEATHER_LON || '9.7391';
  }

  /**
   * Get daily forecast for 14 days (cached for 15 minutes)
   * Returns object keyed by date string (YYYY-MM-DD)
   */
  async getDailyForecast() {
    const cacheKey = 'daily-forecast';
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Europe/Berlin&forecast_days=14&past_days=7`;
      const response = await axios.get(url, { timeout: 5000 });

      const daily = response.data.daily;
      const result = {};
      daily.time.forEach((date, i) => {
        const code = daily.weather_code[i];
        const wmo = WMO_CODES[code] || { emoji: '🌡️', description: 'Ukendt' };
        result[date] = {
          tempMax: Math.round(daily.temperature_2m_max[i]),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          weatherCode: code,
          emoji: wmo.emoji
        };
      });

      this.cache.set(cacheKey, result);
      console.log(`🌤️ Daily forecast updated: ${Object.keys(result).length} days`);
      return result;
    } catch (error) {
      console.error('Daily forecast API error:', error.message);
      return null;
    }
  }

  /**
   * Get current weather data (cached for 15 minutes)
   */
  async getCurrentWeather() {
    const cacheKey = 'current-weather';
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=temperature_2m,weather_code,is_day&timezone=Europe/Berlin`;
      const response = await axios.get(url, { timeout: 5000 });

      const current = response.data.current;
      const weatherCode = current.weather_code;
      const isDay = current.is_day === 1;
      const wmo = WMO_CODES[weatherCode] || { emoji: '🌡️', nightEmoji: '🌙', description: 'Ukendt' };

      const result = {
        temperature: Math.round(current.temperature_2m),
        weatherCode,
        isDay,
        emoji: isDay ? wmo.emoji : wmo.nightEmoji,
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
