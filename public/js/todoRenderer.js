/**
 * Todo Renderer - Displays Microsoft Todo items in two columns
 */
class TodoRenderer {
  constructor() {
    this.col1 = document.getElementById('todo-col-1');
    this.col2 = document.getElementById('todo-col-2');
  }

  /**
   * Format due date in Danish
   */
  formatDueDate(dueDate) {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return 'I dag';
    }

    // Check if tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'I morgen';
    }

    // Check if past due
    if (date < today) {
      return `Forfalden: ${date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' })}`;
    }

    // Future date
    return date.toLocaleDateString('da-DK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  /**
   * Render a single todo item
   */
  renderTodoItem(task) {
    const item = document.createElement('div');
    item.className = 'todo-item';
    if (task.importance === 'high') {
      item.classList.add('high-importance');
    }
    item.style.borderColor = task.listColor || '#666';

    // Checkbox (visual only, no interaction)
    const checkbox = document.createElement('div');
    checkbox.className = 'todo-checkbox';

    // Content
    const content = document.createElement('div');
    content.className = 'todo-content';

    const title = document.createElement('div');
    title.className = 'todo-title';
    title.textContent = task.title;
    content.appendChild(title);

    item.appendChild(checkbox);
    item.appendChild(content);

    return item;
  }

  /**
   * Update the display with todo data
   */
  update(data) {
    const tasks = data.tasks || [];

    // Clear columns
    this.col1.innerHTML = '';
    this.col2.innerHTML = '';

    if (tasks.length === 0) {
      this.col1.innerHTML = '<div class="no-todos">Ingen opgaver</div>';
      return;
    }

    // Calculate max items per column based on available space
    // With ~400px height and ~50px per item, we can fit about 7 items per column
    const maxPerColumn = 7;
    const midpoint = Math.min(Math.ceil(tasks.length / 2), maxPerColumn);

    // Distribute tasks between columns
    tasks.forEach((task, index) => {
      const item = this.renderTodoItem(task);

      if (index < midpoint) {
        this.col1.appendChild(item);
      } else if (index < midpoint * 2) {
        this.col2.appendChild(item);
      }
      // Tasks beyond capacity are not shown (they wouldn't fit anyway)
    });

    console.log(`📋 Rendered ${Math.min(tasks.length, maxPerColumn * 2)} of ${tasks.length} tasks`);
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.col1.innerHTML = '<div class="loading">Indlæser...</div>';
    this.col2.innerHTML = '';
  }
}

// Export for use in app.js
window.TodoRenderer = TodoRenderer;
