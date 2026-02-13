module.exports = {
  // Google Calendars to display
  // Each calendar needs an ID (from Google Calendar settings) and display properties
  calendars: [
    {
      id: process.env.CALENDAR_ID_1,
      color: '#33B679',
      name: 'Vores'
    },
    {
      id: process.env.CALENDAR_ID_2,
      color: '#D50000',
      name: 'Fødselsdag'
    },
    {
      id: process.env.CALENDAR_ID_3,
      color: '#039BE5',
      name: 'Gudstjeneste'
    },
    {
      id: process.env.CALENDAR_ID_4,
      color: '#7986CB',
      name: 'Aktiviteter'
    },
    {
      id: process.env.CALENDAR_ID_5,
      color: '#8E24AA',
      name: 'Spejder'
    },
    {
      id: process.env.CALENDAR_ID_6,
      color: '#616161',
      name: 'Interne møder',
      excludeWords: ['Bibelstudiegruppe', 'Bedegruppen']
    },
    {
      id: process.env.CALENDAR_ID_7,
      color: '#EF6C00',
      name: 'Foredrag'
    },
    {
      id: process.env.CALENDAR_ID_8,
      color: '#4285F4',
      name: 'Helligdage'
    }
  ].filter(cal => cal.id), // Only include calendars with configured IDs

  // Cache settings
  cache: {
    calendarTTL: 540000 // 9 minutes in ms
  },

  // Push notification settings
  pushNotifications: {
    enabled: process.env.PUSH_ENABLED === 'true',
    webhookUrl: process.env.WEBHOOK_URL,
    renewalInterval: 6 * 24 * 60 * 60 * 1000 // 6 days (Google channels expire after ~7 days)
  },

  // Monthly themes configuration
  themes: {
    1: {  // January
      name: 'Winter',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      accent: '#4fc3f7',
      headerBg: '#0d1b2a'
    },
    2: {  // February
      name: 'Valentine',
      background: 'linear-gradient(180deg, #2d132c 0%, #801336 100%)',
      accent: '#ff6b9d',
      headerBg: '#1a0a1a'
    },
    3: {  // March
      name: 'Spring',
      background: 'linear-gradient(180deg, #1a2e1a 0%, #2d4a2d 100%)',
      accent: '#81c784',
      headerBg: '#0d1a0d'
    },
    4: {  // April
      name: 'Easter',
      background: 'linear-gradient(180deg, #2e2e1a 0%, #4a3d2d 100%)',
      accent: '#fff59d',
      headerBg: '#1a1a0d'
    },
    5: {  // May
      name: 'Spring Bloom',
      background: 'linear-gradient(180deg, #1a2e1a 0%, #2d5a2d 100%)',
      accent: '#aed581',
      headerBg: '#0d1a0d'
    },
    6: {  // June
      name: 'Summer',
      background: 'linear-gradient(180deg, #2e2a1a 0%, #5a4a2d 100%)',
      accent: '#ffb74d',
      headerBg: '#1a180d'
    },
    7: {  // July
      name: 'Beach',
      background: 'linear-gradient(180deg, #1a2a2e 0%, #2d4a5a 100%)',
      accent: '#4dd0e1',
      headerBg: '#0d181a'
    },
    8: {  // August
      name: 'Late Summer',
      background: 'linear-gradient(180deg, #2e2a1a 0%, #6a4a2d 100%)',
      accent: '#ffa726',
      headerBg: '#1a180d'
    },
    9: {  // September
      name: 'Autumn Begins',
      background: 'linear-gradient(180deg, #2e1a1a 0%, #5a3d2d 100%)',
      accent: '#ffab91',
      headerBg: '#1a0d0d'
    },
    10: { // October
      name: 'Halloween',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
      accent: '#ff9800',
      headerBg: '#0d0d0d'
    },
    11: { // November
      name: 'Autumn',
      background: 'linear-gradient(180deg, #2e1a1a 0%, #4a2d2d 100%)',
      accent: '#bcaaa4',
      headerBg: '#1a0d0d'
    },
    12: { // December
      name: 'Christmas',
      background: 'linear-gradient(180deg, #1a2e1a 0%, #2d1a1a 100%)',
      accent: '#ef5350',
      headerBg: '#0d1a0d'
    }
  }
};
