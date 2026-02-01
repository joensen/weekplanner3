/**
 * Theme Manager - Handles monthly theme switching
 */
class ThemeManager {
  constructor() {
    this.themes = {
      1: {  // January - Winter
        name: 'Winter',
        background: 'linear-gradient(180deg, #2a3a5e 0%, #1e3a5f 100%)',
        accent: '#4fc3f7',
        headerBg: '#1a2d4a'
      },
      2: {  // February - Late Winter
        name: 'Late Winter',
        background: 'linear-gradient(180deg, #2e3e5a 0%, #3a4a6a 100%)',
        accent: '#80d4f7',
        headerBg: '#1e2e4a'
      },
      3: {  // March - Spring
        name: 'Spring',
        background: 'linear-gradient(180deg, #2a4a3a 0%, #3a5a4a 100%)',
        accent: '#81c784',
        headerBg: '#1a3a2a'
      },
      4: {  // April - Easter
        name: 'Easter',
        background: 'linear-gradient(180deg, #4a4a3a 0%, #5a5040 100%)',
        accent: '#fff59d',
        headerBg: '#3a3a2a'
      },
      5: {  // May - Spring Bloom
        name: 'Spring Bloom',
        background: 'linear-gradient(180deg, #2a4a3a 0%, #3a6a4a 100%)',
        accent: '#aed581',
        headerBg: '#1a3a2a'
      },
      6: {  // June - Summer
        name: 'Summer',
        background: 'linear-gradient(180deg, #4a4538 0%, #6a5a40 100%)',
        accent: '#ffb74d',
        headerBg: '#3a3528'
      },
      7: {  // July - Beach
        name: 'Beach',
        background: 'linear-gradient(180deg, #2a4a5a 0%, #3a5a6a 100%)',
        accent: '#4dd0e1',
        headerBg: '#1a3a4a'
      },
      8: {  // August - Late Summer
        name: 'Late Summer',
        background: 'linear-gradient(180deg, #4a4538 0%, #7a5a40 100%)',
        accent: '#ffa726',
        headerBg: '#3a3528'
      },
      9: {  // September - Autumn Begins
        name: 'Autumn Begins',
        background: 'linear-gradient(180deg, #4a3a38 0%, #6a4a40 100%)',
        accent: '#ffab91',
        headerBg: '#3a2a28'
      },
      10: { // October - Halloween
        name: 'Halloween',
        background: 'linear-gradient(180deg, #3a3a3a 0%, #4a4a4a 100%)',
        accent: '#ff9800',
        headerBg: '#2a2a2a'
      },
      11: { // November - Autumn
        name: 'Autumn',
        background: 'linear-gradient(180deg, #4a3a38 0%, #5a4040 100%)',
        accent: '#bcaaa4',
        headerBg: '#3a2a28'
      },
      12: { // December - Christmas
        name: 'Christmas',
        background: 'linear-gradient(180deg, #2a4a3a 0%, #4a2a2a 100%)',
        accent: '#ef5350',
        headerBg: '#1a3a2a'
      }
    };

    this.currentMonth = null;
  }

  /**
   * Apply theme for the current month
   */
  applyCurrentTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const simulatedMonth = parseInt(urlParams.get('month'), 10);
    const month = (simulatedMonth >= 1 && simulatedMonth <= 12) ? simulatedMonth : new Date().getMonth() + 1;

    // Only update if month changed
    if (month === this.currentMonth) return;

    this.currentMonth = month;
    const theme = this.themes[month];

    if (!theme) {
      console.warn(`No theme defined for month ${month}`);
      return;
    }

    console.log(`🎨 Applying ${theme.name} theme for month ${month}`);

    // Apply CSS variables
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--header-bg', theme.headerBg);

    // Also update body background directly (for gradient)
    document.body.style.background = theme.background;
  }

  /**
   * Start theme manager (checks monthly)
   */
  start() {
    this.applyCurrentTheme();

    // Check every hour for month change
    setInterval(() => {
      this.applyCurrentTheme();
    }, 60 * 60 * 1000);
  }
}

// Export for use in app.js
window.ThemeManager = ThemeManager;
