/**
 * Theme Manager - Handles monthly theme switching with day/night modes
 * Dark mode: 22:00 - 06:00
 * Light mode: 06:00 - 22:00
 */
class ThemeManager {
  constructor() {
    // Dark themes (nighttime) - same monthly colors as before
    this.darkThemes = {
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

    // Light themes (daytime) - white background, seasonal accent in header
    this.lightThemes = {
      1: {  // January - Winter
        name: 'Winter',
        background: '#ffffff',
        accent: '#1565c0',
        headerBg: '#e3f2fd'
      },
      2: {  // February - Late Winter
        name: 'Late Winter',
        background: '#ffffff',
        accent: '#1565c0',
        headerBg: '#e3f2fd'
      },
      3: {  // March - Spring
        name: 'Spring',
        background: '#ffffff',
        accent: '#2e7d32',
        headerBg: '#e8f5e9'
      },
      4: {  // April - Easter
        name: 'Easter',
        background: '#ffffff',
        accent: '#e65100',
        headerBg: '#fff8e1'
      },
      5: {  // May - Spring Bloom
        name: 'Spring Bloom',
        background: '#ffffff',
        accent: '#33691e',
        headerBg: '#f1f8e9'
      },
      6: {  // June - Summer
        name: 'Summer',
        background: '#ffffff',
        accent: '#e65100',
        headerBg: '#fff3e0'
      },
      7: {  // July - Beach
        name: 'Beach',
        background: '#ffffff',
        accent: '#00695c',
        headerBg: '#e0f7fa'
      },
      8: {  // August - Late Summer
        name: 'Late Summer',
        background: '#ffffff',
        accent: '#e65100',
        headerBg: '#fff3e0'
      },
      9: {  // September - Autumn Begins
        name: 'Autumn Begins',
        background: '#ffffff',
        accent: '#bf360c',
        headerBg: '#fbe9e7'
      },
      10: { // October - Halloween
        name: 'Halloween',
        background: '#ffffff',
        accent: '#e65100',
        headerBg: '#fff3e0'
      },
      11: { // November - Autumn
        name: 'Autumn',
        background: '#ffffff',
        accent: '#4e342e',
        headerBg: '#efebe9'
      },
      12: { // December - Christmas
        name: 'Christmas',
        background: '#ffffff',
        accent: '#b71c1c',
        headerBg: '#e8f5e9'
      }
    };

    this.currentMonth = null;
    this.currentIsDark = null;
  }

  /**
   * Check if it's dark mode time (22:00 - 06:00)
   */
  isDarkMode() {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 6;
  }

  /**
   * Apply mode-dependent CSS variables for dark or light
   */
  applyModeColors(isDark) {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--text-faded', 'rgba(255, 255, 255, 0.4)');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--overlay-dark', 'rgba(0, 0, 0, 0.2)');
      root.style.setProperty('--dropdown-bg', 'rgb(30, 30, 40)');
      root.style.setProperty('--meal-border', 'rgba(255, 180, 100, 0.4)');
      root.style.setProperty('--meal-bg', 'rgba(255, 180, 100, 0.1)');
      root.style.setProperty('--meal-text-color', 'rgba(255, 200, 140, 0.9)');
      root.style.setProperty('--meal-text-hover-bg', 'rgba(255, 180, 100, 0.2)');
      root.style.setProperty('--meal-text-hover-color', 'rgb(255, 210, 160)');
      root.style.setProperty('--today-highlight', 'rgba(79, 195, 247, 0.15)');
      root.style.setProperty('--today-number-text', '#000');
      root.style.setProperty('--dropdown-hover', 'rgba(79, 195, 247, 0.2)');
      root.style.setProperty('--dropdown-shadow', 'rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--stick-color', '#ffffff');
      root.style.setProperty('--stick-box-bg', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', 'rgba(0, 0, 0, 0.65)');
      root.style.setProperty('--text-faded', 'rgba(0, 0, 0, 0.35)');
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--overlay-dark', 'rgba(0, 0, 0, 0.05)');
      root.style.setProperty('--dropdown-bg', '#ffffff');
      root.style.setProperty('--meal-border', 'rgba(180, 100, 30, 0.35)');
      root.style.setProperty('--meal-bg', 'rgba(180, 100, 30, 0.08)');
      root.style.setProperty('--meal-text-color', 'rgba(150, 80, 10, 0.9)');
      root.style.setProperty('--meal-text-hover-bg', 'rgba(180, 100, 30, 0.15)');
      root.style.setProperty('--meal-text-hover-color', 'rgb(140, 70, 0)');
      root.style.setProperty('--today-highlight', 'rgba(25, 118, 210, 0.1)');
      root.style.setProperty('--today-number-text', '#ffffff');
      root.style.setProperty('--dropdown-hover', 'rgba(25, 118, 210, 0.1)');
      root.style.setProperty('--dropdown-shadow', 'rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--stick-color', '#000000');
      root.style.setProperty('--stick-box-bg', 'rgba(0, 0, 0, 0.08)');
    }
  }

  /**
   * Apply theme for the current month and time of day
   */
  applyCurrentTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const simulatedMonth = parseInt(urlParams.get('month'), 10);
    const month = (simulatedMonth >= 1 && simulatedMonth <= 12) ? simulatedMonth : new Date().getMonth() + 1;
    const isDark = urlParams.get('dark') !== null ? urlParams.get('dark') === '1' : this.isDarkMode();

    // Only update if month or mode changed
    if (month === this.currentMonth && isDark === this.currentIsDark) return;

    this.currentMonth = month;
    this.currentIsDark = isDark;

    const themes = isDark ? this.darkThemes : this.lightThemes;
    const theme = themes[month];

    if (!theme) {
      console.warn(`No theme defined for month ${month}`);
      return;
    }

    const mode = isDark ? 'dark' : 'light';
    console.log(`Applying ${theme.name} theme (${mode}) for month ${month}`);

    // Apply theme colors
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--header-bg', theme.headerBg);
    document.body.style.background = theme.background;

    // Apply mode-dependent colors
    this.applyModeColors(isDark);
  }

  /**
   * Start theme manager (checks every minute for time/month changes)
   */
  start() {
    this.applyCurrentTheme();

    // Check every minute to catch the 22:00/06:00 transitions
    setInterval(() => {
      this.applyCurrentTheme();
    }, 60 * 1000);
  }
}

// Export for use in app.js
window.ThemeManager = ThemeManager;
