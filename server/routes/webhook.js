const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');
const todoService = require('../services/todoService');

// POST /api/webhook/calendar - Google Calendar push notification receiver
router.post('/calendar', (req, res) => {
  try {
    // Validate request headers
    const channelId = req.headers['x-goog-channel-id'];
    const resourceState = req.headers['x-goog-resource-state'];
    const resourceId = req.headers['x-goog-resource-id'];

    console.log(`📅 Calendar webhook received:`);
    console.log(`   Channel ID: ${channelId}`);
    console.log(`   Resource State: ${resourceState}`);
    console.log(`   Resource ID: ${resourceId}`);

    // Handle sync message (initial subscription confirmation)
    if (resourceState === 'sync') {
      console.log('   → Sync message received, channel is active');
      return res.status(200).send();
    }

    // Handle actual change notifications
    if (resourceState === 'exists' || resourceState === 'not_exists') {
      console.log('   → Calendar changed, invalidating cache');

      // Invalidate calendar cache
      calendarService.cache.flushAll();

      // Broadcast update to connected SSE clients
      const broadcastUpdate = req.app.locals.broadcastUpdate;
      if (broadcastUpdate) {
        broadcastUpdate('calendar-update');
      }
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error processing calendar webhook:', error);
    res.status(500).send();
  }
});

// POST /api/webhook/todo - Azure Event Grid (Microsoft Todo) webhook receiver
router.post('/todo', (req, res) => {
  try {
    // Handle Event Grid subscription validation
    if (req.headers['aeg-event-type'] === 'SubscriptionValidation') {
      const validationEvent = req.body[0];
      if (validationEvent && validationEvent.data && validationEvent.data.validationCode) {
        console.log('📋 Todo webhook validation request received');
        return res.json({
          validationResponse: validationEvent.data.validationCode
        });
      }
    }

    // Handle CloudEvents from Event Grid
    const events = Array.isArray(req.body) ? req.body : [req.body];

    events.forEach(event => {
      const eventType = event.type || event.eventType;
      console.log(`📋 Todo webhook received: ${eventType}`);

      if (eventType.includes('ToDo')) {
        console.log('   → Todo changed, invalidating cache');

        // Invalidate todo cache
        if (todoService.cache) {
          todoService.cache.flushAll();
        }

        // Broadcast update to connected SSE clients
        const broadcastUpdate = req.app.locals.broadcastUpdate;
        if (broadcastUpdate) {
          broadcastUpdate('todo-update');
        }
      }
    });

    res.status(200).send();
  } catch (error) {
    console.error('Error processing todo webhook:', error);
    res.status(500).send();
  }
});

module.exports = router;
