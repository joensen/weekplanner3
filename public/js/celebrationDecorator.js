/**
 * Celebration Decorator - Finds holiday/birthday celebrations and manages page visuals.
 */
class CelebrationDecorator {
  constructor() {
    this.familyNames = ['Noah', 'Sarah', 'Leah', 'Hannah', 'Andreas', 'Charlotte'];
    this.urlParams = new URLSearchParams(window.location.search);
    this.previewKeys = this.parsePreviewKeys();
    this.pageLayer = null;

    this.definitions = {
      'constitution-day': {
        key: 'constitution-day',
        label: 'Grundlovsdag',
        shortLabel: 'Grundlov',
        emoji: '🇩🇰',
        type: 'holiday',
        className: 'constitution-day',
        priority: 100,
        tokens: ['🇩🇰', '🇩🇰', '🇩🇰'],
        aliases: ['grundlovsdag', 'constitution day', 'forfatningsdag']
      },
      'fathers-day': {
        key: 'fathers-day',
        label: 'Fars dag',
        shortLabel: 'Far',
        emoji: '💙',
        type: 'holiday',
        className: 'fathers-day',
        priority: 55,
        tokens: ['👔', '☕', '💙', '🎁'],
        aliases: ['fars dag', 'father day', "father's day", 'fathers day']
      },
      'new-year': {
        key: 'new-year',
        label: 'Nytårsdag',
        shortLabel: 'Nytår',
        emoji: '🎆',
        type: 'holiday',
        className: 'new-year',
        priority: 90,
        tokens: ['🎆', '✨', '🎊'],
        aliases: ['nytårsdag', 'nytaarsdag', 'new year']
      },
      'new-year-eve': {
        key: 'new-year-eve',
        label: 'Nytårsaften',
        shortLabel: 'Nytår',
        emoji: '🎇',
        type: 'holiday',
        className: 'new-year-eve',
        priority: 80,
        tokens: ['🎇', '🎆', '✨'],
        aliases: ['nytårsaften', 'nytaarsaften', 'new year eve']
      },
      'maundy-thursday': {
        key: 'maundy-thursday',
        label: 'Skærtorsdag',
        shortLabel: 'Skær',
        emoji: '🌿',
        type: 'holiday',
        className: 'maundy-thursday',
        priority: 60,
        tokens: ['🌿', '🥚', '🕯️'],
        aliases: ['skærtorsdag', 'skaertorsdag', 'maundy thursday']
      },
      'good-friday': {
        key: 'good-friday',
        label: 'Langfredag',
        shortLabel: 'Langfredag',
        emoji: '🕯️',
        type: 'holiday',
        className: 'good-friday',
        priority: 65,
        tokens: ['🕯️', '✦', '✧'],
        aliases: ['langfredag', 'good friday']
      },
      easter: {
        key: 'easter',
        label: 'Påskedag',
        shortLabel: 'Påske',
        emoji: '🐣',
        type: 'holiday',
        className: 'easter',
        priority: 75,
        tokens: ['🐣', '🥚', '🌼'],
        aliases: ['påskedag', 'paaskedag', 'paskedag', 'easter sunday']
      },
      'easter-monday': {
        key: 'easter-monday',
        label: '2. påskedag',
        shortLabel: 'Påske',
        emoji: '🥚',
        type: 'holiday',
        className: 'easter-monday',
        priority: 60,
        tokens: ['🥚', '🌼', '🌿'],
        aliases: ['2. påskedag', 'anden påskedag', 'easter monday']
      },
      ascension: {
        key: 'ascension',
        label: 'Kristi himmelfartsdag',
        shortLabel: 'Himmel',
        emoji: '☁️',
        type: 'holiday',
        className: 'ascension',
        priority: 70,
        tokens: ['☁️', '☀️', '✦'],
        aliases: ['kristi himmelfartsdag', 'ascension']
      },
      pentecost: {
        key: 'pentecost',
        label: 'Pinsedag',
        shortLabel: 'Pinse',
        emoji: '🔥',
        type: 'holiday',
        className: 'pentecost',
        priority: 70,
        tokens: ['🔥', '✨', '🕊️'],
        aliases: ['pinsedag', 'pinse', 'whit sunday', 'pentecost']
      },
      'pentecost-monday': {
        key: 'pentecost-monday',
        label: '2. pinsedag',
        shortLabel: 'Pinse',
        emoji: '✨',
        type: 'holiday',
        className: 'pentecost-monday',
        priority: 60,
        tokens: ['✨', '🔥', '🕊️'],
        aliases: ['2. pinsedag', 'anden pinsedag', 'whit monday']
      },
      'christmas-eve': {
        key: 'christmas-eve',
        label: 'Juleaftensdag',
        shortLabel: 'Jul',
        emoji: '🎄',
        type: 'holiday',
        className: 'christmas-eve',
        priority: 85,
        tokens: ['🎄', '✨', '🎁'],
        aliases: ['juleaftensdag', 'juleaften', 'christmas eve']
      },
      christmas: {
        key: 'christmas',
        label: 'Juledag',
        shortLabel: 'Jul',
        emoji: '🎄',
        type: 'holiday',
        className: 'christmas',
        priority: 95,
        tokens: ['🎄', '❄️', '✨', '🎁'],
        aliases: ['juledag', '1. juledag', 'christmas day']
      },
      'boxing-day': {
        key: 'boxing-day',
        label: '2. juledag',
        shortLabel: 'Jul',
        emoji: '❄️',
        type: 'holiday',
        className: 'boxing-day',
        priority: 70,
        tokens: ['❄️', '🎄', '✨'],
        aliases: ['2. juledag', 'anden juledag', 'boxing day']
      },
      holiday: {
        key: 'holiday',
        label: 'Helligdag',
        shortLabel: 'Helligdag',
        emoji: '🇩🇰',
        type: 'holiday',
        className: 'holiday-generic',
        priority: 40,
        tokens: ['🇩🇰', '✨'],
        aliases: []
      }
    };
  }

  parsePreviewKeys() {
    const preview = this.urlParams.get('celebrationPreview') || this.urlParams.get('holidayPreview') || '';
    return preview.split(',').map(key => key.trim()).filter(Boolean);
  }

  normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/å/g, 'aa')
      .replace(/[’']/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  getEffectiveToday() {
    const todayParam = this.urlParams.get('today');
    if (/^\d{4}-\d{2}-\d{2}$/.test(todayParam || '')) {
      const [year, month, day] = todayParam.split('-').map(Number);
      return new Date(year, month - 1, day, 12, 0, 0);
    }
    return new Date();
  }

  isToday(date) {
    return date.toDateString() === this.getEffectiveToday().toDateString();
  }

  isHolidayCalendar(event) {
    return this.normalize(event.calendarName) === 'helligdage';
  }

  isBirthdayCalendar(event) {
    const calendarName = this.normalize(event.calendarName);
    return calendarName === 'fodselsdag' || calendarName === 'fodselsdage';
  }

  matchHoliday(event) {
    const text = this.normalize(`${event.summary || ''} ${event.description || ''}`);
    const match = Object.values(this.definitions)
      .filter(def => def.type === 'holiday' && def.aliases.length)
      .sort((a, b) => {
        const longestA = Math.max(...a.aliases.map(alias => this.normalize(alias).length));
        const longestB = Math.max(...b.aliases.map(alias => this.normalize(alias).length));
        return longestB - longestA;
      })
      .find(def => def.aliases.some(alias => text.includes(this.normalize(alias))));

    if (!match) {
      return {
        ...this.definitions.holiday,
        label: event.summary || this.definitions.holiday.label
      };
    }

    return { ...match, sourceLabel: event.summary || match.label };
  }

  matchBirthday(event) {
    const text = this.normalize(`${event.summary || ''} ${event.description || ''}`);
    const familyName = this.familyNames.find(name => text.includes(this.normalize(name)));
    if (!familyName) return null;

    const key = `birthday-${familyName.toLowerCase()}`;
    return {
      key,
      label: `${familyName}s fødselsdag`,
      shortLabel: familyName,
      emoji: '🎂',
      type: 'birthday',
      className: key,
      priority: 82,
      tokens: this.getBirthdayTokens(familyName),
      familyName,
      sourceLabel: event.summary || `${familyName}s fødselsdag`
    };
  }

  getBirthdayTokens(name) {
    const tokensByName = {
      Noah: ['🎈', '🎂', '💚', '💙'],
      Sarah: ['🎈', '🎂', '⭐', '💗'],
      Leah: ['🎈', '🎂', '💜', '💛'],
      Hannah: ['🎈', '🎂', '✨', '🩵'],
      Andreas: ['🎈', '🎂', '⭐', '🧡'],
      Charlotte: ['🎈', '🎂', '🌹', '✨']
    };
    return tokensByName[name] || ['🎈', '🎂', '✨'];
  }

  getPreviewCelebrations() {
    return this.previewKeys.map(key => {
      if (key.startsWith('birthday-')) {
        const name = this.familyNames.find(candidate => key === `birthday-${candidate.toLowerCase()}`);
        if (!name) return null;
        return this.matchBirthday({
          calendarName: 'Fødselsdag',
          summary: `${name}s fødselsdag`
        });
      }
      return this.definitions[key] ? { ...this.definitions[key] } : null;
    }).filter(Boolean);
  }

  dedupeCelebrations(celebrations) {
    const byKey = new Map();
    celebrations.forEach(celebration => {
      if (!byKey.has(celebration.key)) {
        byKey.set(celebration.key, celebration);
      }
    });
    return Array.from(byKey.values());
  }

  getCelebrationsForDay(date, events) {
    const celebrations = [];

    (events || []).forEach(event => {
      if (this.isHolidayCalendar(event)) {
        celebrations.push(this.matchHoliday(event));
      } else if (this.isBirthdayCalendar(event)) {
        const birthday = this.matchBirthday(event);
        if (birthday) celebrations.push(birthday);
      }
    });

    if (this.isToday(date) && this.previewKeys.length > 0) {
      celebrations.push(...this.getPreviewCelebrations());
    }

    return this.dedupeCelebrations(celebrations)
      .sort((a, b) => b.priority - a.priority);
  }

  getPrimaryCelebration(celebrations) {
    if (!celebrations.length) return null;
    return celebrations.slice().sort((a, b) => b.priority - a.priority)[0];
  }

  applyRowCelebrations(dayRow, dayHeader, celebrations, isToday) {
    if (!celebrations.length) return;

    dayRow.classList.add('celebration-day');
    if (isToday) dayRow.classList.add('celebration-today');

    celebrations.forEach(celebration => {
      dayRow.classList.add(`celebration-${celebration.className}`);
    });

    const label = document.createElement('span');
    label.className = 'celebration-label';
    label.textContent = celebrations.map(celebration => `${celebration.emoji} ${celebration.label}`).join(' · ');
    dayHeader.appendChild(label);
  }

  applyPageCelebrations(celebrations) {
    const body = document.body;
    Array.from(body.classList)
      .filter(className => className.startsWith('page-celebration'))
      .forEach(className => body.classList.remove(className));

    if (this.pageLayer) {
      this.pageLayer.remove();
      this.pageLayer = null;
    }

    if (!celebrations.length) return;

    const primary = this.getPrimaryCelebration(celebrations);
    body.classList.add('page-celebration-active');
    body.classList.add(`page-celebration-${primary.className}`);
    celebrations.forEach(celebration => {
      body.classList.add(`page-celebration-has-${celebration.className}`);
    });

    const layer = document.createElement('div');
    layer.id = 'celebration-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.className = `celebration-layer celebration-layer-${primary.className}`;

    const tokens = celebrations.flatMap(celebration => celebration.tokens || []);
    const safeTokens = tokens.length ? tokens : ['✨'];
    const count = Math.min(72, Math.max(28, safeTokens.length * 14));

    for (let i = 0; i < count; i++) {
      const token = document.createElement('span');
      token.className = 'celebration-token';
      token.textContent = safeTokens[i % safeTokens.length];
      token.style.setProperty('--x', `${(i * 37) % 100}%`);
      token.style.setProperty('--y', `${(i * 53) % 100}%`);
      token.style.setProperty('--size', `${26 + ((i * 11) % 34)}px`);
      token.style.setProperty('--rotate', `${-18 + ((i * 17) % 36)}deg`);
      token.style.setProperty('--delay', `${(i % 9) * -0.35}s`);
      layer.appendChild(token);
    }

    body.insertBefore(layer, body.firstChild);
    this.pageLayer = layer;
  }
}

window.CelebrationDecorator = CelebrationDecorator;
