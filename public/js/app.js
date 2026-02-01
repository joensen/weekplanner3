/**
 * Weekplanner3 - Main Application
 * Family dashboard for Google Calendar
 */

(function() {
  'use strict';

  // Initialize components
  const themeManager = new ThemeManager();
  const headerRenderer = new HeaderRenderer();
  const mealRenderer = new MealRenderer();
  const weekRenderer = new WeekRenderer(mealRenderer);

  // Initialize update manager with callbacks
  const updateManager = new UpdateManager({
    onCalendarUpdate: (data) => {
      weekRenderer.update(data);
    },
    onMealUpdate: (data) => {
      mealRenderer.update(data);
      weekRenderer.refresh();
    }
  });

  /**
   * Initialize the application
   */
  function init() {
    console.log('🚀 Weekplanner3 starting...');

    // Apply monthly theme
    themeManager.start();

    // Start the clock
    headerRenderer.start();

    // Show loading states
    weekRenderer.showLoading();

    // Start update manager (loads data and connects to SSE)
    updateManager.start();

    console.log('✅ Weekplanner3 initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.weekplanner = {
    themeManager,
    headerRenderer,
    mealRenderer,
    weekRenderer,
    updateManager,
    refresh: () => updateManager.loadAll()
  };

})();
