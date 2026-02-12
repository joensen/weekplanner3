/**
 * Meals API Routes
 */
const express = require('express');
const router = express.Router();
const mealService = require('../services/mealService');

/**
 * GET /api/meals
 * Get meals for display (current + next week)
 */
router.get('/', (req, res) => {
  try {
    const data = mealService.getMealsForDisplay();
    res.json(data);
  } catch (error) {
    console.error('Error getting meals:', error);
    res.status(500).json({
      error: 'Failed to get meals',
      message: error.message
    });
  }
});

/**
 * PUT /api/meals/:date
 * Change meal for a specific date
 */
router.put('/:date', (req, res) => {
  try {
    const { date } = req.params;
    const { meal, category } = req.body;

    if (!meal) {
      return res.status(400).json({
        error: 'Missing meal parameter'
      });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const result = mealService.changeMeal(date, meal, category);

    // Broadcast update to all SSE clients
    if (req.app.locals.broadcastUpdate) {
      req.app.locals.broadcastUpdate('meal-update');
    }

    res.json(result);
  } catch (error) {
    console.error('Error changing meal:', error);
    res.status(500).json({
      error: 'Failed to change meal',
      message: error.message
    });
  }
});

module.exports = router;
