/**
 * Meal Service - Manages meal selection and persistence
 */
const fs = require('fs');
const path = require('path');

class MealService {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/meals.json');
    this.defaultDataPath = path.join(__dirname, '../data/meals-default.json');
    this.data = null;
  }

  /**
   * Load data from JSON file.
   * If meals.json doesn't exist, copy from meals-default.json first.
   */
  loadData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        // Copy seed data on first run
        if (fs.existsSync(this.defaultDataPath)) {
          fs.copyFileSync(this.defaultDataPath, this.dataPath);
          console.log('Created meals.json from meals-default.json');
        }
      }
      const content = fs.readFileSync(this.dataPath, 'utf8');
      this.data = JSON.parse(content);
      // Backfill emoji for categories that don't have one
      for (const cat of Object.values(this.data.categories || {})) {
        if (!cat.emoji) cat.emoji = '\ud83c\udf7d\ufe0f';
      }
    } catch (error) {
      console.error('Error loading meals data:', error);
      // Initialize with default structure
      this.data = {
        categories: {},
        weekdayCategories: {},
        weeklySelections: {},
        history: [],
        historyWeeks: 3
      };
    }
    return this.data;
  }

  /**
   * Save data to JSON file (atomic write)
   */
  saveData() {
    try {
      const tempPath = this.dataPath + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.dataPath);
    } catch (error) {
      console.error('Error saving meals data:', error);
      throw error;
    }
  }

  /**
   * Get the start of a week (Monday) for a given date
   */
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get ISO week number
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  /**
   * Get ISO week key (e.g., "2026-W05")
   */
  getWeekKey(date) {
    const weekStart = this.getWeekStart(date);
    const year = weekStart.getFullYear();
    const weekNum = this.getWeekNumber(weekStart);
    return `${year}-W${weekNum.toString().padStart(2, '0')}`;
  }

  /**
   * Format date as YYYY-MM-DD (using local time)
   */
  formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get category for a specific weekday (0=Sunday, 1=Monday, etc.)
   */
  getCategoryForWeekday(dayOfWeek) {
    return this.data.weekdayCategories[dayOfWeek.toString()] || 'frit';
  }

  /**
   * Get meals not used in last N weeks
   */
  getAvailableMeals(categoryId) {
    const category = this.data.categories[categoryId];
    if (!category || !category.meals || category.meals.length === 0) {
      return [];
    }

    // Get cutoff date (historyWeeks ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (this.data.historyWeeks * 7));

    // Filter out recently used meals
    const recentMeals = new Set(
      this.data.history
        .filter(h => new Date(h.date) >= cutoffDate)
        .map(h => h.meal)
    );

    const available = category.meals.filter(meal => !recentMeals.has(meal));

    // If all meals were recently used, return all meals (fallback)
    return available.length > 0 ? available : category.meals;
  }

  /**
   * Select a random meal from available options
   */
  selectRandomMeal(categoryId) {
    const available = this.getAvailableMeals(categoryId);
    if (available.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * available.length);
    return available[index];
  }

  /**
   * Generate meals for a week
   */
  generateWeekMeals(weekStart) {
    const weekKey = this.getWeekKey(weekStart);

    // Don't regenerate if already exists
    if (this.data.weeklySelections[weekKey]) {
      return this.data.weeklySelections[weekKey];
    }

    const selections = {};
    const weekStartDate = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + i);
      const dateKey = this.formatDateKey(date);
      const dayOfWeek = date.getDay();
      const categoryId = this.getCategoryForWeekday(dayOfWeek);
      const meal = this.selectRandomMeal(categoryId);

      selections[dateKey] = {
        meal: meal,
        category: categoryId
      };

      // Add to history if meal was selected
      if (meal) {
        this.addToHistory(meal, dateKey, categoryId);
      }
    }

    this.data.weeklySelections[weekKey] = selections;
    this.pruneOldSelections();
    this.pruneHistory();
    this.saveData();

    return selections;
  }

  /**
   * Add meal to history
   */
  addToHistory(meal, date, category) {
    // Check if already in history for this date
    const existing = this.data.history.find(h => h.date === date);
    if (existing) {
      existing.meal = meal;
      existing.category = category;
    } else {
      this.data.history.push({ meal, date, category });
    }
  }

  /**
   * Remove old history entries
   */
  pruneHistory() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (this.data.historyWeeks * 7));

    this.data.history = this.data.history.filter(
      h => new Date(h.date) >= cutoffDate
    );
  }

  /**
   * Remove old week selections (keep only current and next 2 weeks)
   */
  pruneOldSelections() {
    const now = new Date();

    // Calculate week keys to keep
    const keysToKeep = new Set();
    for (let i = -1; i <= 2; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + (i * 7));
      keysToKeep.add(this.getWeekKey(date));
    }

    // Remove old selections
    Object.keys(this.data.weeklySelections).forEach(key => {
      if (!keysToKeep.has(key)) {
        delete this.data.weeklySelections[key];
      }
    });
  }

  /**
   * Check and generate meals for current and next week
   */
  checkAndGenerateNewWeek() {
    this.loadData();

    const now = new Date();
    const currentWeekStart = this.getWeekStart(now);
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    // Generate current week if needed
    this.generateWeekMeals(currentWeekStart);

    // Generate next week if needed
    this.generateWeekMeals(nextWeekStart);
  }

  /**
   * Get meals for display (current + next week)
   */
  getMealsForDisplay() {
    this.checkAndGenerateNewWeek();

    const now = new Date();
    const currentWeekKey = this.getWeekKey(now);
    const nextWeekStart = new Date(this.getWeekStart(now));
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeekKey = this.getWeekKey(nextWeekStart);

    // Merge selections from both weeks
    const meals = {
      ...(this.data.weeklySelections[currentWeekKey] || {}),
      ...(this.data.weeklySelections[nextWeekKey] || {})
    };

    // Add category names to each meal
    Object.keys(meals).forEach(dateKey => {
      const selection = meals[dateKey];
      if (selection && selection.category) {
        const category = this.data.categories[selection.category];
        selection.categoryName = category ? category.name : selection.category;
      }
    });

    return {
      meals,
      categories: this.data.categories,
      weekdayCategories: this.data.weekdayCategories,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Find category for a meal
   */
  findCategoryForMeal(meal) {
    for (const [categoryId, category] of Object.entries(this.data.categories)) {
      if (category.meals && category.meals.includes(meal)) {
        return categoryId;
      }
    }
    return 'andet';
  }

  /**
   * Change meal for a specific date
   */
  changeMeal(dateStr, newMeal, categoryId = null) {
    this.loadData();

    // Find which week this date belongs to
    const date = new Date(dateStr);
    const weekKey = this.getWeekKey(date);

    if (!this.data.weeklySelections[weekKey]) {
      this.data.weeklySelections[weekKey] = {};
    }

    // Use provided category, or find it from the meal, or fall back to weekday category
    if (!categoryId) {
      categoryId = this.findCategoryForMeal(newMeal);
    }

    // Update selection
    this.data.weeklySelections[weekKey][dateStr] = {
      meal: newMeal,
      category: categoryId
    };

    // Update history
    this.addToHistory(newMeal, dateStr, categoryId);

    this.saveData();

    return {
      success: true,
      date: dateStr,
      meal: newMeal,
      category: categoryId
    };
  }

  // ─── CRUD Methods for Admin ──────────────────────────────────────

  /**
   * Get all data for admin display
   */
  getAllData() {
    this.loadData();
    return {
      categories: this.data.categories,
      weekdayCategories: this.data.weekdayCategories
    };
  }

  /**
   * Add a new category
   */
  addCategory(id, name, emoji = '\ud83c\udf7d\ufe0f') {
    this.loadData();

    if (this.data.categories[id]) {
      throw new Error(`Kategori '${id}' findes allerede`);
    }

    this.data.categories[id] = { name, emoji, meals: [] };
    this.saveData();
    return this.data.categories[id];
  }

  /**
   * Rename a category
   */
  renameCategory(id, newName, newEmoji) {
    this.loadData();

    if (!this.data.categories[id]) {
      throw new Error(`Kategori '${id}' blev ikke fundet`);
    }

    this.data.categories[id].name = newName;
    if (newEmoji !== undefined) {
      this.data.categories[id].emoji = newEmoji;
    }
    this.saveData();
    return this.data.categories[id];
  }

  /**
   * Delete a category (prevent if assigned to a weekday)
   */
  deleteCategory(id) {
    this.loadData();

    if (!this.data.categories[id]) {
      throw new Error(`Kategori '${id}' blev ikke fundet`);
    }

    // Check if assigned to any weekday
    const assignedDays = Object.entries(this.data.weekdayCategories)
      .filter(([, catId]) => catId === id)
      .map(([day]) => day);

    if (assignedDays.length > 0) {
      throw new Error(`Kategorien er tildelt ugedage og kan ikke slettes`);
    }

    delete this.data.categories[id];
    this.saveData();
  }

  /**
   * Add a meal to a category
   */
  addMeal(categoryId, mealName) {
    this.loadData();

    const category = this.data.categories[categoryId];
    if (!category) {
      throw new Error(`Kategori '${categoryId}' blev ikke fundet`);
    }

    if (category.meals.includes(mealName)) {
      throw new Error(`'${mealName}' findes allerede i denne kategori`);
    }

    category.meals.push(mealName);
    this.saveData();
    return category;
  }

  /**
   * Rename a meal within a category. Also updates weekly selections and history.
   */
  renameMeal(categoryId, oldName, newName) {
    this.loadData();

    const category = this.data.categories[categoryId];
    if (!category) {
      throw new Error(`Kategori '${categoryId}' blev ikke fundet`);
    }

    const index = category.meals.indexOf(oldName);
    if (index === -1) {
      throw new Error(`'${oldName}' blev ikke fundet i kategorien`);
    }

    if (category.meals.includes(newName)) {
      throw new Error(`'${newName}' findes allerede i denne kategori`);
    }

    // Update in category
    category.meals[index] = newName;

    // Update in weekly selections
    for (const weekSelections of Object.values(this.data.weeklySelections)) {
      for (const selection of Object.values(weekSelections)) {
        if (selection.meal === oldName) {
          selection.meal = newName;
        }
      }
    }

    // Update in history
    for (const entry of this.data.history) {
      if (entry.meal === oldName) {
        entry.meal = newName;
      }
    }

    this.saveData();
    return category;
  }

  /**
   * Delete a meal from a category. Also cleans up weekly selections.
   */
  deleteMeal(categoryId, mealName) {
    this.loadData();

    const category = this.data.categories[categoryId];
    if (!category) {
      throw new Error(`Kategori '${categoryId}' blev ikke fundet`);
    }

    const index = category.meals.indexOf(mealName);
    if (index === -1) {
      throw new Error(`'${mealName}' blev ikke fundet i kategorien`);
    }

    category.meals.splice(index, 1);

    // Remove from weekly selections where this meal was selected
    for (const weekSelections of Object.values(this.data.weeklySelections)) {
      for (const [dateKey, selection] of Object.entries(weekSelections)) {
        if (selection.meal === mealName) {
          selection.meal = null;
        }
      }
    }

    this.saveData();
    return category;
  }

  /**
   * Update weekday-to-category mapping
   */
  updateWeekdayCategories(mapping) {
    this.loadData();

    // Validate all category IDs exist
    for (const [day, catId] of Object.entries(mapping)) {
      if (!this.data.categories[catId]) {
        throw new Error(`Kategori '${catId}' blev ikke fundet`);
      }
    }

    this.data.weekdayCategories = mapping;
    this.saveData();
    return this.data.weekdayCategories;
  }
}

// Export singleton instance
module.exports = new MealService();
