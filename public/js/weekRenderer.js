/**
 * Week Renderer - Renders calendar weeks with events
 */
class WeekRenderer {
  constructor() {
    this.week1Container = document.getElementById('week-1-days');
    this.week2Container = document.getElementById('week-2-days');
    this.week1NumberEl = document.getElementById('week-1-number');
    this.week2NumberEl = document.getElementById('week-2-number');

    // Danish day names
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
   * Format a date as YYYY-MM-DD
   */
  formatDateKey(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Check if a date is today
   */
  isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Check if a date is in the past
   */
  isPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  /**
   * Format event time
   */
  formatEventTime(event) {
    if (event.isAllDay) {
      return 'Hele dagen';
    }

    const start = new Date(event.start);
    return start.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Render a single day row
   */
  renderDay(date, events) {
    const dayRow = document.createElement('div');
    dayRow.className = 'day-row';

    // Add today/past classes
    if (this.isToday(date)) {
      dayRow.classList.add('today');
    } else if (this.isPast(date)) {
      dayRow.classList.add('past');
    }

    // Day header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';

    const dayName = document.createElement('span');
    dayName.className = 'day-name';
    dayName.textContent = this.dayNames[date.getDay()];

    const dayNumber = document.createElement('span');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();

    dayHeader.appendChild(dayName);
    dayHeader.appendChild(dayNumber);
    dayRow.appendChild(dayHeader);

    // Events container
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'events-container';

    if (events && events.length > 0) {
      events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        if (event.isAllDay) {
          eventItem.classList.add('all-day');
        }
        eventItem.style.borderColor = event.calendarColor;

        const eventTime = document.createElement('span');
        eventTime.className = 'event-time';
        eventTime.textContent = this.formatEventTime(event);

        const eventTitle = document.createElement('span');
        eventTitle.className = 'event-title';
        eventTitle.textContent = event.summary;

        eventItem.appendChild(eventTime);
        eventItem.appendChild(eventTitle);
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
   * Update the display with calendar data
   */
  update(data) {
    if (!data || !data.weeks || data.weeks.length < 2) {
      console.warn('Invalid calendar data');
      return;
    }

    const eventsByDate = data.eventsByDate || {};

    // Week 1 (current week)
    const week1 = data.weeks[0];
    this.week1NumberEl.textContent = week1.weekNumber;
    const week1Start = new Date(week1.startDate);
    const week1Dates = this.getWeekDates(week1Start);
    this.renderWeek(this.week1Container, week1.weekNumber, week1Dates, eventsByDate);

    // Week 2 (next week)
    const week2 = data.weeks[1];
    this.week2NumberEl.textContent = week2.weekNumber;
    const week2Start = new Date(week2.startDate);
    const week2Dates = this.getWeekDates(week2Start);
    this.renderWeek(this.week2Container, week2.weekNumber, week2Dates, eventsByDate);

    console.log(`📅 Rendered weeks ${week1.weekNumber} and ${week2.weekNumber}`);
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
