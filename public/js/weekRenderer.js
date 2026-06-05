/**
 * Week Renderer - Renders calendar weeks with events
 */
class WeekRenderer {
  constructor(mealRenderer) {
    this.week1Container = document.getElementById('week-1-days');
    this.week2Container = document.getElementById('week-2-days');
    this.week1NumberEl = document.getElementById('week-1-number');
    this.week2NumberEl = document.getElementById('week-2-number');
    this.mealRenderer = mealRenderer || null;
    this.lastCalendarData = null;
    this.weatherData = null;
    this.celebrationDecorator = window.CelebrationDecorator ? new CelebrationDecorator() : null;

    // Danish day names (full form)
    this.dayNames = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  }

  /**
   * Get the start of a week (Monday) for a given date
   */
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  /**
   * Get an array of dates for a week starting from Monday
   */
  getWeekDates(weekStart) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  /**
   * Format a date as YYYY-MM-DD (local time)
   */
  formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parse a YYYY-MM-DD string as local date (not UTC)
   */
  parseLocalDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0); // Noon to avoid timezone issues
  }

  /**
   * Check if a date is today
   */
  isToday(date) {
    const today = this.celebrationDecorator ? this.celebrationDecorator.getEffectiveToday() : new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Check if a date is in the past
   */
  isPast(date) {
    const today = this.celebrationDecorator ? this.celebrationDecorator.getEffectiveToday() : new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  /**
   * Format event time
   */
  formatEventTime(event) {
    const start = new Date(event.start);
    return start.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Sort events: all-day first (alphabetically), then timed events (by time)
   */
  sortEvents(events) {
    return events.slice().sort((a, b) => {
      // All-day events come first
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;

      // Both all-day: sort alphabetically
      if (a.isAllDay && b.isAllDay) {
        return a.summary.localeCompare(b.summary, 'da');
      }

      // Both timed: sort by start time
      return new Date(a.start) - new Date(b.start);
    });
  }

  /**
   * Render a single day row
   */
  renderDay(date, events) {
    const dayRow = document.createElement('div');
    dayRow.className = 'day-row';
    const dateKey = this.formatDateKey(date);
    const isToday = this.isToday(date);
    const celebrations = this.celebrationDecorator
      ? this.celebrationDecorator.getCelebrationsForDay(date, events)
      : [];

    // Add today/past classes
    if (isToday) {
      dayRow.classList.add('today');
    } else if (this.isPast(date)) {
      dayRow.classList.add('past');
    }

    // Day header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';

    const dayNumber = document.createElement('span');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();

    const dayName = document.createElement('span');
    dayName.className = 'day-name';
    dayName.textContent = this.dayNames[date.getDay()];

    dayHeader.appendChild(dayNumber);
    dayHeader.appendChild(dayName);

    // Add weather forecast if available
    if (this.weatherData && this.weatherData[dateKey]) {
      const w = this.weatherData[dateKey];
      const weatherEl = document.createElement('span');
      weatherEl.className = 'day-weather';
      weatherEl.textContent = `${w.emoji} ${w.tempMax}° / ${w.tempMin}°`;
      dayHeader.appendChild(weatherEl);
    }

    if (this.celebrationDecorator) {
      this.celebrationDecorator.applyRowCelebrations(dayRow, dayHeader, celebrations, isToday);
    }

    // Add meal display if mealRenderer is available
    if (this.mealRenderer) {
      const mealElement = this.mealRenderer.createMealElement(dateKey);
      dayHeader.appendChild(mealElement);
    }

    dayRow.appendChild(dayHeader);

    // Events container
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'events-container';

    if (events && events.length > 0) {
      const sortedEvents = this.sortEvents(events);
      sortedEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        if (event.isAllDay) {
          eventItem.classList.add('all-day');
        }
        eventItem.style.borderColor = event.calendarColor;

        const eventTitle = document.createElement('span');
        eventTitle.className = 'event-title';
        eventTitle.textContent = this.celebrationDecorator
          ? this.celebrationDecorator.getEventDisplayTitle(event)
          : event.summary;

        eventItem.appendChild(eventTitle);

        // Show time as right-aligned toast for timed events
        if (!event.isAllDay) {
          const eventTime = document.createElement('span');
          eventTime.className = 'event-time';
          eventTime.textContent = this.formatEventTime(event);
          eventItem.appendChild(eventTime);
        }

        // Birthday age toast
        if (!this.celebrationDecorator
          ? event.calendarName === 'Fødselsdag'
          : this.celebrationDecorator.isBirthdayCalendar(event)) {
          const age = this.calcBirthdayAge(event, date);
          if (age !== null) {
            const toast = document.createElement('span');
            toast.className = 'birthday-age-toast';
            toast.textContent = `${age} år`;
            eventItem.appendChild(toast);
          }
        }

        eventsContainer.appendChild(eventItem);
      });
    } else {
      const noEvents = document.createElement('div');
      noEvents.className = 'no-events';
      noEvents.textContent = 'Ingen begivenheder';
      eventsContainer.appendChild(noEvents);
    }

    dayRow.appendChild(eventsContainer);
    return dayRow;
  }

  /**
   * Get celebrations for the effective today date from the rendered data.
   */
  getTodayCelebrations(eventsByDate) {
    if (!this.celebrationDecorator) return [];
    const today = this.celebrationDecorator.getEffectiveToday();
    const todayKey = this.formatDateKey(today);
    const todayEvents = eventsByDate[todayKey] || [];
    return this.celebrationDecorator.getCelebrationsForDay(today, todayEvents);
  }

  /**
   * Extract birth year from a birthday event and calculate age
   */
  calcBirthdayAge(event, eventDate) {
    // Look for a 4-digit year (1900-2099) in summary or description
    const text = (event.summary || '') + ' ' + (event.description || '');
    const match = text.match(/\b(19\d{2}|20\d{2})\b/);
    if (!match) return null;
    const birthYear = parseInt(match[1], 10);
    const age = eventDate.getFullYear() - birthYear;
    return age > 0 && age < 150 ? age : null;
  }

  /**
   * Render a week column
   */
  renderWeek(container, weekNumber, weekDates, eventsByDate) {
    container.innerHTML = '';

    weekDates.forEach(date => {
      const dateKey = this.formatDateKey(date);
      const dayEvents = eventsByDate[dateKey] || [];
      const dayRow = this.renderDay(date, dayEvents);
      container.appendChild(dayRow);
    });
  }

  /**
   * Fetch daily weather forecast
   */
  async fetchWeatherForecast() {
    try {
      const response = await fetch('/api/weather/forecast');
      if (!response.ok) return;
      this.weatherData = await response.json();
    } catch (error) {
      console.error('Weather forecast fetch error:', error);
    }
  }

  /**
   * Update the display with calendar data
   */
  async update(data) {
    if (!data || !data.weeks || data.weeks.length < 2) {
      console.warn('Invalid calendar data, keeping existing display');
      return;
    }

    // Don't clear existing events if new data has zero events (likely a failed upstream fetch)
    const eventsByDate = data.eventsByDate || {};
    const totalEvents = Object.values(eventsByDate).reduce((sum, arr) => sum + arr.length, 0);
    if (totalEvents === 0 && this.lastCalendarData) {
      console.warn('Received empty events while we have existing data, skipping update');
      return;
    }

    // Fetch weather forecast
    await this.fetchWeatherForecast();

    // Store for refresh
    this.lastCalendarData = data;

    // Week 1 (current week)
    const week1 = data.weeks[0];
    this.week1NumberEl.textContent = week1.weekNumber;
    const week1Start = this.parseLocalDate(week1.startDate);
    const week1Dates = this.getWeekDates(week1Start);
    this.renderWeek(this.week1Container, week1.weekNumber, week1Dates, eventsByDate);

    // Week 2 (next week)
    const week2 = data.weeks[1];
    this.week2NumberEl.textContent = week2.weekNumber;
    const week2Start = this.parseLocalDate(week2.startDate);
    const week2Dates = this.getWeekDates(week2Start);
    this.renderWeek(this.week2Container, week2.weekNumber, week2Dates, eventsByDate);

    if (this.celebrationDecorator) {
      this.celebrationDecorator.applyPageCelebrations(this.getTodayCelebrations(eventsByDate));
    }

    console.log(`📅 Rendered weeks ${week1.weekNumber} and ${week2.weekNumber}`);

    // Auto-scroll columns so bottom events are visible, but today stays in view
    this.autoScroll(this.week1Container);
    this.autoScroll(this.week2Container);
  }

  /**
   * Auto-scroll a days-container so bottom content is visible,
   * but if today is in this column, ensure it remains visible.
   */
  autoScroll(container) {
    // No overflow, nothing to do
    if (container.scrollHeight <= container.clientHeight) return;

    const todayRow = container.querySelector('.day-row.today');

    if (!todayRow) {
      // No today in this column - just scroll to bottom
      container.scrollTop = container.scrollHeight - container.clientHeight;
      return;
    }

    // Scroll so that all of today's events are visible,
    // and as much of the content below today as possible.
    // Position: today's bottom aligned with container's bottom,
    // but never scroll today's top out of view.
    const todayBottom = todayRow.offsetTop + todayRow.offsetHeight;
    const idealScroll = todayBottom - container.clientHeight;

    // Don't scroll above today's top (would hide the start of today)
    container.scrollTop = Math.max(0, Math.min(idealScroll, todayRow.offsetTop));
  }

  /**
   * Refresh display with last data (for meal updates)
   */
  refresh() {
    if (this.lastCalendarData) {
      this.update(this.lastCalendarData);
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    [this.week1Container, this.week2Container].forEach(container => {
      container.innerHTML = '<div class="loading">Indlæser...</div>';
    });
  }
}

// Export for use in app.js
window.WeekRenderer = WeekRenderer;
