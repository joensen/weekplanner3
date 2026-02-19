const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// GET /api/weather/forecast - Daily forecast for 14 days
router.get('/forecast', async (req, res) => {
  try {
    const data = await weatherService.getDailyForecast();
    if (!data) {
      return res.status(503).json({ error: 'Forecast data unavailable' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error in forecast route:', error);
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// GET /api/weather - Fetch current weather
router.get('/', async (req, res) => {
  try {
    const data = await weatherService.getCurrentWeather();
    if (!data) {
      return res.status(503).json({ error: 'Weather data unavailable' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error in weather route:', error);
    res.status(500).json({
      error: 'Failed to fetch weather',
      message: error.message
    });
  }
});

module.exports = router;
