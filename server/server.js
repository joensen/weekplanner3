require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const calendarRouter = require('./routes/calendar');
const webhookRouter = require('./routes/webhook');
const simulateRouter = require('./routes/simulate');
const mealsRouter = require('./routes/meals');
const calendarService = require('./services/calendarService');

const app = express();
const PORT = process.env.PORT || 3000;

// SSE clients for real-time updates
const sseClients = new Set();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/calendar', calendarRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/meals', mealsRouter);

// SSE endpoint for real-time updates
app.get('/api/events-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // For nginx

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  // Add client to set
  sseClients.add(res);
  console.log(`SSE client connected. Total clients: ${sseClients.size}`);

  // Handle client disconnect
  req.on('close', () => {
    sseClients.delete(res);
    console.log(`SSE client disconnected. Total clients: ${sseClients.size}`);
  });
});

// Function to broadcast updates to all SSE clients
function broadcastUpdate(type) {
  const message = JSON.stringify({ type, timestamp: new Date().toISOString() });
  sseClients.forEach(client => {
    client.write(`data: ${message}\n\n`);
  });
  console.log(`Broadcasted ${type} update to ${sseClients.size} clients`);
}

// Export for use in webhook routes
app.locals.broadcastUpdate = broadcastUpdate;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    sseClients: sseClients.size
  });
});

// Clear cache endpoint (for testing)
app.post('/api/clear-cache', (_req, res) => {
  try {
    calendarService.cache.flushAll();

    console.log('Cache cleared manually');
    res.json({
      success: true,
      message: 'All caches cleared. Next API call will fetch fresh data.'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, async () => {
  const mockMode = process.env.MOCK_MODE === 'true';
  const pushEnabled = process.env.PUSH_ENABLED === 'true';
  const webhookUrl = process.env.WEBHOOK_URL;

  console.log(`=================================`);
  console.log(`Weekplanner3 Server Started`);
  console.log(`=================================`);
  console.log(`Port: ${PORT}`);
  console.log(`Time: ${new Date().toLocaleString('da-DK')}`);
  console.log(`Mode: ${mockMode ? '🎭 MOCK MODE (simulated data)' : '🌐 LIVE MODE'}`);
  console.log(`Push: ${pushEnabled ? '✓ Enabled' : '✗ Disabled'}`);
  console.log(`=================================`);
  console.log(`Endpoints:`);
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://localhost:${PORT}/api/calendar`);
  console.log(`  - http://localhost:${PORT}/api/meals`);
  console.log(`  - http://localhost:${PORT}/api/events-stream (SSE)`);
  console.log(`  - http://localhost:${PORT}/health`);
  console.log(`  - POST http://localhost:${PORT}/api/clear-cache`);

  if (mockMode) {
    console.log(`=================================`);
    console.log(`Simulation Endpoints (mock mode only):`);
    console.log(`  - POST http://localhost:${PORT}/api/simulate/calendar-push`);
    console.log(`  - POST http://localhost:${PORT}/api/simulate/refresh-all`);
    console.log(`  - GET  http://localhost:${PORT}/api/simulate/status`);
  }

  console.log(`=================================`);

  // Set up Google Calendar push notifications
  if (!mockMode && pushEnabled && webhookUrl) {
    console.log(`\nSetting up Google Calendar push notifications...`);
    console.log(`Webhook URL: ${webhookUrl}`);

    try {
      const channels = await calendarService.setupAllWatchChannels(webhookUrl);
      if (channels.length > 0) {
        console.log(`✓ Watch channels created for ${channels.length} calendar(s)`);

        // Store channels for potential cleanup
        app.locals.watchChannels = channels;

        // Set up renewal before expiration (channels expire after ~7 days)
        const renewalInterval = 6 * 24 * 60 * 60 * 1000; // 6 days
        setInterval(async () => {
          console.log('Renewing watch channels...');
          const newChannels = await calendarService.setupAllWatchChannels(webhookUrl);
          app.locals.watchChannels = newChannels;
          console.log(`✓ Watch channels renewed for ${newChannels.length} calendar(s)`);
        }, renewalInterval);
      } else {
        console.log('✗ No watch channels were created');
      }
    } catch (error) {
      console.error('✗ Error setting up push notifications:', error.message);
    }
  }
});
