/**
 * Mock Data Service - Generates realistic test data for UI development
 */

class MockDataService {
  constructor() {
    // Danish day names
    this.dayNames = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

    // Sample calendar colors (matching Google Calendar)
    this.calendars = [
      { name: 'Familie', color: '#33B679' },
      { name: 'Arbejde', color: '#D50000' },
      { name: 'Skole', color: '#039BE5' },
      { name: 'Sport', color: '#7986CB' },
      { name: 'Aktiviteter', color: '#8E24AA' },
      { name: 'Fødselsdage', color: '#F4511E' },
      { name: 'Helligdage', color: '#616161' }
    ];

    // Sample events by category
    this.eventTemplates = {
      Familie: [
        'Familiemiddag',
        'Bedsteforældre på besøg',
        'Fødselsdagsfest',
        'Spilleaften',
        'Film aften',
        'Brunch hos mormor'
      ],
      Arbejde: [
        'Team møde',
        'Projektgennemgang',
        'Kundemøde',
        'Frokost med kolleger',
        'Deadline: Rapport',
        'Præsentation'
      ],
      Skole: [
        'Forældremøde',
        'Skolefest',
        'Aflevering af projekt',
        'SFO arrangement',
        'Klasseudplugt',
        'Skole/hjem samtale'
      ],
      Sport: [
        'Fodboldtræning',
        'Svømning',
        'Håndboldkamp',
        'Gymnastik',
        'Løbetur',
        'Fitness'
      ],
      Aktiviteter: [
        'Spejder',
        'Musikskole',
        'Tegneundervisning',
        'Dans',
        'Kor øvelse',
        'Bibelstudium'
      ],
      Fødselsdage: [
        'Anders fødselsdag 🎂',
        'Marie fødselsdag 🎂',
        'Morfar fødselsdag 🎂',
        'Moster fødselsdag 🎂'
      ],
      Helligdage: [
        'Helligdag',
        'Ferie',
        'Skolefri'
      ]
    };

    // Sample todo items
    this.todoTemplates = [
      { title: 'Køb mælk og brød', list: 'Indkøb', importance: 'normal' },
      { title: 'Hent pakke på posthuset', list: 'Gøremål', importance: 'high' },
      { title: 'Ring til tandlægen', list: 'Gøremål', importance: 'high' },
      { title: 'Vask bilen', list: 'Gøremål', importance: 'normal' },
      { title: 'Bestil flyrejse', list: 'Familie', importance: 'normal' },
      { title: 'Køb fødselsdagsgave til Anders', list: 'Indkøb', importance: 'high' },
      { title: 'Reparer cykelpunktering', list: 'Gøremål', importance: 'normal' },
      { title: 'Aflevér bøger på biblioteket', list: 'Gøremål', importance: 'low' },
      { title: 'Bestil tid hos frisør', list: 'Gøremål', importance: 'normal' },
      { title: 'Køb gave til jubilæum', list: 'Indkøb', importance: 'normal' },
      { title: 'Ryd op i garage', list: 'Hjemme', importance: 'low' },
      { title: 'Skift olie i bil', list: 'Gøremål', importance: 'normal' },
      { title: 'Planlæg sommerferie', list: 'Familie', importance: 'normal' },
      { title: 'Køb ny seng til gæsteværelse', list: 'Indkøb', importance: 'low' }
    ];

    this.todoListColors = {
      'Indkøb': '#FF5733',
      'Gøremål': '#33FF57',
      'Familie': '#3357FF',
      'Hjemme': '#FF33F5'
    };
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
   * Generate a random time between start and end hours
   */
  randomTime(startHour, endHour) {
    const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const minute = Math.random() < 0.5 ? 0 : 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  /**
   * Generate mock calendar events
   */
  generateCalendarData() {
    const now = new Date();
    const currentWeekStart = this.getWeekStart(now);
    const events = [];
    const eventsByDate = {};

    // Generate events for 2 weeks (14 days)
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      // Random number of events per day (1-5)
      const numEvents = Math.floor(Math.random() * 5) + 1;
      const dayEvents = [];

      for (let i = 0; i < numEvents; i++) {
        // Pick a random calendar
        const calendar = this.calendars[Math.floor(Math.random() * this.calendars.length)];
        const templates = this.eventTemplates[calendar.name] || this.eventTemplates['Familie'];
        const summary = templates[Math.floor(Math.random() * templates.length)];

        // Determine if all-day event (20% chance)
        const isAllDay = Math.random() < 0.2;

        let event;
        if (isAllDay) {
          event = {
            id: `mock-${dateStr}-${i}`,
            summary: summary,
            start: dateStr,
            end: dateStr,
            isAllDay: true,
            calendarColor: calendar.color,
            calendarName: calendar.name
          };
        } else {
          const startTime = this.randomTime(7, 20);
          const startDateTime = `${dateStr}T${startTime}:00`;
          const endHour = parseInt(startTime.split(':')[0]) + 1;
          const endTime = `${endHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}`;
          const endDateTime = `${dateStr}T${endTime}:00`;

          event = {
            id: `mock-${dateStr}-${i}`,
            summary: summary,
            start: startDateTime,
            end: endDateTime,
            isAllDay: false,
            calendarColor: calendar.color,
            calendarName: calendar.name
          };
        }

        events.push(event);
        dayEvents.push(event);
      }

      // Sort events: all-day first, then by time, grouped by color
      dayEvents.sort((a, b) => {
        if (a.calendarColor !== b.calendarColor) {
          return a.calendarColor.localeCompare(b.calendarColor);
        }
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return a.start.localeCompare(b.start);
      });

      eventsByDate[dateStr] = dayEvents;
    }

    // Calculate week info
    const currentWeekNumber = this.getWeekNumber(now);
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeekNumber = this.getWeekNumber(nextWeekStart);

    return {
      events: events,
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
          year: nextWeekStart.getFullYear(),
          startDate: nextWeekStart.toISOString().split('T')[0],
          isCurrent: false
        }
      ],
      today: now.toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      isMockData: true
    };
  }

  /**
   * Generate mock todo items
   */
  generateTodoData() {
    const now = new Date();

    // Select random subset of todos (6-10 items)
    const numTodos = Math.floor(Math.random() * 5) + 6;
    const shuffled = [...this.todoTemplates].sort(() => Math.random() - 0.5);
    const selectedTodos = shuffled.slice(0, numTodos);

    const tasks = selectedTodos.map((todo, index) => {
      // Random due date (some past, some future, some none)
      let dueDate = null;
      const dueDateChance = Math.random();
      if (dueDateChance < 0.7) {
        const daysOffset = Math.floor(Math.random() * 14) - 3; // -3 to +10 days
        const dueDateTime = new Date(now);
        dueDateTime.setDate(dueDateTime.getDate() + daysOffset);
        dueDate = dueDateTime.toISOString().split('T')[0];
      }

      return {
        id: `mock-todo-${index}`,
        title: todo.title,
        dueDate: dueDate,
        importance: todo.importance,
        listId: `list-${todo.list}`,
        listName: todo.list,
        listColor: this.todoListColors[todo.list] || '#666666'
      };
    });

    // Sort: high importance first, then by due date
    tasks.sort((a, b) => {
      const importanceOrder = { high: 0, normal: 1, low: 2 };
      const impA = importanceOrder[a.importance] || 1;
      const impB = importanceOrder[b.importance] || 1;
      if (impA !== impB) return impA - impB;

      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });

    return {
      tasks: tasks,
      lastUpdated: new Date().toISOString(),
      isMockData: true
    };
  }
}

module.exports = new MockDataService();
