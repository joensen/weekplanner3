/**
 * Theme Manager - Handles monthly theme switching
 */
class ThemeManager {
  constructor() {
    this.themes = {
      1: {  // January - Winter
        name: 'Winter',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        accent: '#4fc3f7',
        headerBg: '#0d1b2a'
      },
      2: {  // February - Valentine
        name: 'Valentine',
        background: 'linear-gradient(180deg, #2d132c 0%, #801336 100%)',
        accent: '#ff6b9d',
        headerBg: '#1a0a1a'
      },
      3: {  // March - Spring
        name: 'Spring',
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d4a2d 100%)',
        accent: '#81c784',
        headerBg: '#0d1a0d'
      },
      4: {  // April - Easter
        name: 'Easter',
        background: 'linear-gradient(180deg, #2e2e1a 0%, #4a3d2d 100%)',
        accent: '#fff59d',
        headerBg: '#1a1a0d'
      },
      5: {  // May - Spring Bloom
        name: 'Spring Bloom',
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d5a2d 100%)',
        accent: '#aed581',
        headerBg: '#0d1a0d'
      },
      6: {  // June - Summer
        name: 'Summer',
        background: 'linear-gradient(180deg, #2e2a1a 0%, #5a4a2d 100%)',
        accent: '#ffb74d',
        headerBg: '#1a180d'
      },
      7: {  // July - Beach
        name: 'Beach',
        background: 'linear-gradient(180deg, #1a2a2e 0%, #2d4a5a 100%)',
        accent: '#4dd0e1',
        headerBg: '#0d181a'
      },
      8: {  // August - Late Summer
        name: 'Late Summer',
        background: 'linear-gradient(180deg, #2e2a1a 0%, #6a4a2d 100%)',
        accent: '#ffa726',
        headerBg: '#1a180d'
      },
      9: {  // September - Autumn Begins
        name: 'Autumn Begins',
        background: 'linear-gradient(180deg, #2e1a1a 0%, #5a3d2d 100%)',
        accent: '#ffab91',
        headerBg: '#1a0d0d'
      },
      10: { // October - Halloween
        name: 'Halloween',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
        accent: '#ff9800',
        headerBg: '#0d0d0d'
      },
      11: { // November - Autumn
        name: 'Autumn',
        background: 'linear-gradient(180deg, #2e1a1a 0%, #4a2d2d 100%)',
        accent: '#bcaaa4',
        headerBg: '#1a0d0d'
      },
      12: { // December - Christmas
        name: 'Christmas',
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d1a1a 100%)',
        accent: '#ef5350',
        headerBg: '#0d1a0d'
      }
    };

    this.currentMonth = null;
  }

  /**
   * Apply theme for the current month
   */
  applyCurrentTheme() {
    const month = new Date().getMonth() + 1; // 1-12

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
