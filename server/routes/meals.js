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

// ─── Admin CRUD Endpoints (before :date param route) ───────────

/**
 * GET /api/meals/admin
 * Get all categories, meals, and weekday mappings for admin
 */
router.get('/admin', (req, res) => {
  try {
    const data = mealService.getAllData();
    res.json(data);
  } catch (error) {
    console.error('Error getting admin data:', error);
    res.status(500).json({ error: 'Failed to get admin data', message: error.message });
  }
});

/**
 * POST /api/meals/categories
 * Create a new category
 */
router.post('/categories', (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'Mangler id og name' });
    }
    if (!/^[a-z0-9_-]+$/.test(id)) {
      return res.status(400).json({ error: 'ID må kun indeholde små bogstaver, tal, bindestreg og underscore' });
    }
    const result = mealService.addCategory(id, name);
    if (req.app.locals.broadcastUpdate) req.app.locals.broadcastUpdate('meal-update');
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/meals/categories/:id
 * Rename a category
 */
router.put('/categories/:id', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Mangler name' });
    }
    const result = mealService.renameCategory(req.params.id, name);
    if (req.app.locals.broadcastUpdate) req.app.locals.broadcastUpdate('meal-update');
    res.json(result);
  } catch (error) {
    console.error('Error renaming category:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/meals/categories/:id
 * Delete a category
 */
router.delete('/categories/:id', (req, res) => {
  try {
    mealService.deleteCategory(req.params.id);
    if (req.app.locals.broadcastUpdate) req.app.locals.broadcastUpdate('meal-update');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/meals/categories/:id/meals
 * Add a meal to a category
 */
router.post('/categories/:id/meals', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Mangler name' });
    }
    const result = mealService.addMeal(req.params.id, name);
    if (req.app.locals.broadcastUpdate) req.app.locals.broadcastUpdate('meal-update');
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/meals/categories/:id/meals
 * Rename a meal in a category
 */
router.put('/categories/:id/meals', (req, res) => {
  try {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
      return res.status(400).json({ error: 'Mangler oldName og newName' });
    }
    const result = mealService.renameMeal(req.params.id, oldName, newName);
    if (req.app.locals.broadcastUpdate) req.app.locals.broadcastUpdate('meal-update');
    res.json(result);
  } catch (error) {
    console.error('Error renaming meal:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/meals/categories/:id/meals/:meal
 * Delete a meal from a category
 */
router.delete('/categories/:id/meals/:meal', (req, res) => {
  try {
    const mealName = decodeURIComponent(req.params.meal);
    const result = mealService.deleteMeal(req.params.id, mealName);
    if (req.app.locals.broadcastUpdate) req.app.locals.broadcastUpdate('meal-update');
    res.json(result);
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/meals/weekday-categories
 * Update weekday-to-category mapping
 */
router.put('/weekday-categories', (req, res) => {
  try {
    const mapping = req.body;
    if (!mapping || typeof mapping !== 'object') {
      return res.status(400).json({ error: 'Mangler weekday mapping objekt' });
    }
    const result = mealService.updateWeekdayCategories(mapping);
    if (req.app.locals.broadcastUpdate) req.app.locals.broadcastUpdate('meal-update');
    res.json(result);
  } catch (error) {
    console.error('Error updating weekday categories:', error);
    res.status(400).json({ error: error.message });
  }
});

// ─── Date-specific routes (after named routes) ─────────────────

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
