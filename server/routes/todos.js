const express = require('express');
const router = express.Router();
const todoService = require('../services/todoService');

// GET /api/todos - Fetch all todo items (incomplete only)
router.get('/', async (req, res) => {
  try {
    const data = await todoService.fetchAllTasks();
    res.json(data);
  } catch (error) {
    console.error('Error in todos route:', error);
    res.status(500).json({
      error: 'Failed to fetch todos',
      message: error.message
    });
  }
});

module.exports = router;
