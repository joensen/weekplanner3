const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');

// GET /api/calendar - Fetch all calendar events
router.get('/', async (req, res) => {
  try {
    const data = await calendarService.fetchAllEvents();
    res.json(data);
  } catch (error) {
    console.error('Error in calendar route:', error);
    res.status(500).json({
      error: 'Failed to fetch calendar events',
      message: error.message
    });
  }
});

// GET /api/calendar/week/:weekOffset - Fetch events for a specific week
router.get('/week/:weekOffset', async (req, res) => {
  try {
    const weekOffset = parseInt(req.params.weekOffset, 10) || 0;
    const data = await calendarService.fetchEventsForWeek(weekOffset);
    res.json(data);
  } catch (error) {
    console.error('Error in calendar week route:', error);
    res.status(500).json({
      error: 'Failed to fetch week events',
      message: error.message
    });
  }
});

module.exports = router;
