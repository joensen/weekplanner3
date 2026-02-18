const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

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
