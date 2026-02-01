const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');

/**
 * Simulation routes for testing UI without real integrations
 * Only available when MOCK_MODE=true
 */

// Middleware to check mock mode
router.use((req, res, next) => {
  if (process.env.MOCK_MODE !== 'true') {
    return res.status(403).json({
      error: 'Simulation endpoints only available in mock mode',
      hint: 'Set MOCK_MODE=true in your .env file'
    });
  }
  next();
});

// POST /api/simulate/calendar-push - Simulate a calendar push notification
router.post('/calendar-push', (req, res) => {
  console.log('🔔 Simulating calendar push notification...');

  // Clear calendar cache to force regeneration
  calendarService.cache.flushAll();

  // Broadcast update to SSE clients
  const broadcastUpdate = req.app.locals.broadcastUpdate;
  if (broadcastUpdate) {
    broadcastUpdate('calendar-update');
    console.log('✅ Calendar update broadcasted to clients');
  }

  res.json({
    success: true,
    message: 'Calendar push notification simulated',
    timestamp: new Date().toISOString()
  });
});

// POST /api/simulate/refresh-all - Regenerate all mock data
router.post('/refresh-all', (req, res) => {
  console.log('🔄 Regenerating all mock data...');

  // Clear all caches
  calendarService.cache.flushAll();

  // Broadcast updates
  const broadcastUpdate = req.app.locals.broadcastUpdate;
  if (broadcastUpdate) {
    broadcastUpdate('calendar-update');
    console.log('✅ Updates broadcasted to clients');
  }

  res.json({
    success: true,
    message: 'All mock data regenerated',
    timestamp: new Date().toISOString()
  });
});

// GET /api/simulate/status - Get simulation status
router.get('/status', (req, res) => {
  res.json({
    mockMode: true,
    calendarCached: calendarService.cache.has('all_events'),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
