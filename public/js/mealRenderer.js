/**
 * Meal Renderer - Displays meals and handles dropdown selection
 */
class MealRenderer {
  constructor() {
    this.mealsData = null;
    this.activeDropdown = null;

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (this.activeDropdown && !e.target.closest('.meal-container')) {
        this.hideDropdown();
      }
    });
  }

  /**
   * Get emoji for a category
   */
  getEmojiForCategory(categoryId) {
    return this.mealsData?.categories?.[categoryId]?.emoji || '\u{1F37D}\u{FE0F}';
  }

  /**
   * Update with meal data from server
   */
  update(data) {
    this.mealsData = data;
  }

  /**
   * Get meal for a specific date
   */
  getMealForDate(dateStr) {
    return this.mealsData?.meals?.[dateStr] || null;
  }

  /**
   * Get alternative meals for a date (same category)
   */
  getAlternatives(dateStr) {
    const mealData = this.getMealForDate(dateStr);
    if (!mealData || !mealData.category) {
      return [];
    }
    const category = this.mealsData.categories[mealData.category];
    return category?.meals || [];
  }

  /**
   * Create meal display element for a day
   */
  createMealElement(dateStr) {
    const container = document.createElement('div');
    container.className = 'meal-container';
    container.dataset.date = dateStr;

    const mealData = this.getMealForDate(dateStr);

    // Food icon based on category
    const icon = document.createElement('span');
    icon.className = 'meal-icon';
    icon.textContent = mealData ? this.getEmojiForCategory(mealData.category) : '\u{1F37D}';
    container.appendChild(icon);

    // Meal text (clickable)
    const mealText = document.createElement('span');
    mealText.className = 'meal-text';

    if (mealData && mealData.meal) {
      mealText.textContent = mealData.meal;
      mealText.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown(container, dateStr);
      });
    } else {
      mealText.textContent = '-';
      mealText.classList.add('no-meal');
    }

    container.appendChild(mealText);
    return container;
  }

  /**
   * Toggle dropdown visibility
   */
  toggleDropdown(container, dateStr) {
    // If clicking same container, toggle off
    if (this.activeDropdown && this.activeDropdown.parentElement === container) {
      this.hideDropdown();
      return;
    }

    // Hide any existing dropdown
    this.hideDropdown();

    // Create and show new dropdown
    this.showDropdown(container, dateStr);
  }

  /**
   * Show dropdown with alternatives
   */
  showDropdown(container, dateStr) {
    const alternatives = this.getAlternatives(dateStr);
    if (alternatives.length === 0) {
      return;
    }

    const currentMeal = this.getMealForDate(dateStr)?.meal;

    const dropdown = document.createElement('div');
    dropdown.className = 'meal-dropdown';

    alternatives.forEach(meal => {
      const item = document.createElement('div');
      item.className = 'meal-dropdown-item';
      if (meal === currentMeal) {
        item.classList.add('selected');
      }
      item.textContent = meal;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectMeal(dateStr, meal);
      });
      dropdown.appendChild(item);
    });

    container.appendChild(dropdown);
    container.closest('.day-row')?.classList.add('dropdown-active');
    this.activeDropdown = dropdown;

    // Position dropdown to stay within viewport
    this.positionDropdown(dropdown, container);
  }

  /**
   * Position dropdown within viewport
   */
  positionDropdown(dropdown, container) {
    const rect = container.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();

    // Check if dropdown goes below viewport
    if (rect.bottom + dropdownRect.height > window.innerHeight) {
      dropdown.style.bottom = '100%';
      dropdown.style.top = 'auto';
    }

    // Check if dropdown goes off right edge
    if (rect.right + dropdownRect.width > window.innerWidth) {
      dropdown.style.right = '0';
      dropdown.style.left = 'auto';
    }
  }

  /**
   * Hide active dropdown
   */
  hideDropdown() {
    if (this.activeDropdown) {
      this.activeDropdown.closest('.day-row')?.classList.remove('dropdown-active');
      this.activeDropdown.remove();
      this.activeDropdown = null;
    }
  }

  /**
   * Select a meal and update via API
   */
  async selectMeal(dateStr, meal) {
    this.hideDropdown();

    try {
      const response = await fetch(`/api/meals/${dateStr}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Update will come via SSE broadcast
      console.log(`Meal changed for ${dateStr}: ${meal}`);
    } catch (error) {
      console.error('Error changing meal:', error);
    }
  }
}

// Export for use in app.js
window.MealRenderer = MealRenderer;
