const { google } = require('googleapis');
const { NodeCache } = require('@cacheable/node-cache');
const config = require('../config/config');
const mockDataService = require('./mockDataService');

// Initialize cache with TTL from config
const cache = new NodeCache({ stdTTL: config.cache.calendarTTL / 1000 });

class CalendarService {
  constructor() {
    this.calendar = null;
    this.initialized = false;
    this.cache = cache;
    this.mockMode = process.env.MOCK_MODE === 'true';
  }

  initialize() {
    if (this.initialized) return;

    // In mock mode, skip Google API initialization
    if (this.mockMode) {
      console.log('📋 Calendar service running in MOCK MODE');
      this.initialized = true;
      return;
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      console.log('💡 Tip: Set MOCK_MODE=true in .env to use simulated data');
      return;
    }

    this.calendar = google.calendar({
      version: 'v3',
      auth: apiKey
    });
    this.initialized = true;
    console.log('Calendar service initialized');
  }

  /**
   * Get the start of a week (Monday) for a given date
   */
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff));
  }

  /**
   * Get ISO week number for a date
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  /**
   * Fetch events from a single calendar
   */
  async fetchEventsForCalendar(calendarConfig, timeMin, timeMax) {
    try {
      const response = await this.calendar.events.list({
        calendarId: calendarConfig.id,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 100
      });

      const events = response.data.items || [];

      if (events.length > 0) {
        console.log(`✓ Fetched ${events.length} events from ${calendarConfig.name}`);
      }

      // Add calendar metadata to each event
      return events.map(event => ({
        id: event.id,
        summary: event.summary || 'Ingen titel',
        description: event.description || '',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        isAllDay: !event.start.dateTime,
        calendarId: calendarConfig.id,
        calendarColor: calendarConfig.color,
        calendarName: calendarConfig.name,
        location: event.location || ''
      }));
    } catch (error) {
      console.error(`✗ Error fetching calendar ${calendarConfig.name}:`, error.message);
      if (error.code === 404) {
        console.error(`  → Calendar not found or not accessible`);
      } else if (error.code === 403) {
        console.error(`  → Access forbidden - calendar might be private`);
      }
      return [];
    }
  }

  /**
   * Fetch all events for the current week and next week
   */
  async fetchAllEvents() {
    this.initialize();

    // Mock mode: return simulated data
    if (this.mockMode) {
      const cachedData = cache.get('all_events');
      if (cachedData) {
        console.log('Returning cached mock calendar data');
        return cachedData;
      }

      console.log('🎭 Generating mock calendar data...');
      const mockData = mockDataService.generateCalendarData();
      cache.set('all_events', mockData);
      return mockData;
    }

    if (!this.initialized) {
      console.error('Calendar service not initialized - check API key');
      const cachedData = cache.get('all_events');
      if (cachedData) {
        console.log('Returning cached calendar data (service not initialized)');
        return cachedData;
      }
      return { events: [], weeks: [], lastUpdated: new Date().toISOString() };
    }

    // Check cache first
    const cachedData = cache.get('all_events');
    if (cachedData) {
      console.log('Returning cached calendar data');
      return cachedData;
    }

    console.log('Fetching fresh calendar data from Google Calendar API...');

    try {
      // Calculate time range: start of current week to end of next week
      const now = new Date();
      const currentWeekStart = this.getWeekStart(now);
      const nextWeekEnd = new Date(currentWeekStart);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 14); // 2 weeks

      // Go back to start of current week
      const timeMin = new Date(currentWeekStart);
      timeMin.setHours(0, 0, 0, 0);

      const timeMax = new Date(nextWeekEnd);
      timeMax.setHours(23, 59, 59, 999);

      // Fetch events from all calendars in parallel
      const allCalendarPromises = config.calendars.map(cal =>
        this.fetchEventsForCalendar(cal, timeMin.toISOString(), timeMax.toISOString())
      );

      const results = await Promise.all(allCalendarPromises);

      // Merge all events into a single array
      const allEvents = results.flat();

      // Group events by date and calendar color for display
      const eventsByDate = this.groupEventsByDate(allEvents);

      // Calculate week info
      const currentWeekNumber = this.getWeekNumber(now);
      const nextWeekNumber = currentWeekNumber === 52 ? 1 : currentWeekNumber + 1;

      const result = {
        events: allEvents,
        eventsByDate: eventsByDate,
        weeks: [
          {
            weekNumber: currentWeekNumber,
            year: now.getFullYear(),
            startDate: currentWeekStart.toISOString().split('T')[0],
            isCurrent: true
          },
          {
            weekNumber: nextWeekNumber,
            year: nextWeekNumber === 1 ? now.getFullYear() + 1 : now.getFullYear(),
            startDate: new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isCurrent: false
          }
        ],
        today: now.toISOString().split('T')[0],
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      cache.set('all_events', result);
      console.log(`Fetched ${allEvents.length} events from ${config.calendars.length} calendars`);

      return result;
    } catch (error) {
      console.error('Error fetching calendar events:', error.message);

      // Fallback to cached data even if expired
      const cachedData = cache.get('all_events');
      if (cachedData) {
        console.log('Returning expired cached data due to error');
        return cachedData;
      }

      return { events: [], weeks: [], lastUpdated: new Date().toISOString() };
    }
  }

  /**
   * Group events by date for easier rendering
   */
  groupEventsByDate(events) {
    const grouped = {};

    events.forEach(event => {
      // Get the date part of the start time
      const dateStr = event.start.split('T')[0];

      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(event);
    });

    // Sort events within each date: first by color group, then by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        // First sort by calendar color
        if (a.calendarColor !== b.calendarColor) {
          return a.calendarColor.localeCompare(b.calendarColor);
        }
        // Then sort by time (all-day events first, then by start time)
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return new Date(a.start) - new Date(b.start);
      });
    });

    return grouped;
  }

  /**
   * Get events for a specific week (0 = current, 1 = next, etc.)
   */
  async fetchEventsForWeek(weekOffset = 0) {
    const data = await this.fetchAllEvents();

    if (weekOffset < data.weeks.length) {
      const week = data.weeks[weekOffset];
      const weekStart = new Date(week.startDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekEvents = data.events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= weekStart && eventDate < weekEnd;
      });

      return {
        ...week,
        events: weekEvents,
        lastUpdated: data.lastUpdated
      };
    }

    return { events: [], lastUpdated: data.lastUpdated };
  }
}

module.exports = new CalendarService();
