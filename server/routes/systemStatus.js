const express = require('express');
const router = express.Router();
const systemStatusService = require('../services/systemStatusService');

router.get('/', async (_req, res) => {
  try {
    const status = await systemStatusService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error in system status route:', error);
    res.status(500).json({
      status: 'warning',
      source: 'route',
      message: 'Kunne ikke hente systemstatus.',
      detail: error.message
    });
  }
});

module.exports = router;
