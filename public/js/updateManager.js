/**
 * Update Manager - Handles SSE real-time updates and fallback polling
 */
class UpdateManager {
  constructor(options) {
    this.onCalendarUpdate = options.onCalendarUpdate || (() => {});
    this.onMealUpdate = options.onMealUpdate || (() => {});

    this.eventSource = null;
    this.pollInterval = null;
    this.pollIntervalMs = 5 * 60 * 1000; // 5 minutes fallback
    this.reconnectDelay = 5000; // 5 seconds
    this.maxReconnectDelay = 60000; // 1 minute max
    this.currentReconnectDelay = this.reconnectDelay;

    // Connection status tracking
    this.online = navigator.onLine;
    this.statusEl = null;
    this.initStatusIndicator();

    // Listen for browser online/offline events
    window.addEventListener('online', () => this.setOnline(true));
    window.addEventListener('offline', () => this.setOnline(false));
  }

  /**
   * Create connection status indicator in the header
   */
  initStatusIndicator() {
    this.statusEl = document.createElement('div');
    this.statusEl.id = 'connection-status';
    this.updateStatusIndicator();
    const header = document.getElementById('header');
    if (header) {
      header.appendChild(this.statusEl);
    }
  }

  /**
   * Update the visual connection indicator
   */
  updateStatusIndicator() {
    if (!this.statusEl) return;
    this.statusEl.className = this.online ? 'status-online' : 'status-offline';
    this.statusEl.title = this.online ? 'Forbundet' : 'Ingen forbindelse';
  }

  /**
   * Set connection status
   */
  setOnline(isOnline) {
    this.online = isOnline;
    this.updateStatusIndicator();
  }

  /**
   * Start the update manager
   */
  start() {
    // Connect to SSE
    this.connectSSE();

    // Initial data load
    this.loadAll();

    // Start fallback polling
    this.startPolling();

    console.log('🔄 Update manager started');
  }

  /**
   * Connect to Server-Sent Events endpoint
   */
  connectSSE() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    console.log('📡 Connecting to SSE...');
    this.eventSource = new EventSource('/api/events-stream');

    this.eventSource.onopen = () => {
      console.log('✅ SSE connected');
      this.currentReconnectDelay = this.reconnectDelay; // Reset delay on successful connection
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📨 SSE message: ${data.type}`);

        switch (data.type) {
          case 'connected':
            console.log('SSE connection confirmed');
            break;
          case 'calendar-update':
            console.log('Calendar update received, refreshing...');
            this.loadCalendar();
            break;
          case 'meal-update':
            console.log('Meal update received, refreshing...');
            this.loadMeals();
            break;
          default:
            console.log('Unknown SSE event type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.warn('❌ SSE connection error, will reconnect...');
      this.eventSource.close();

      // Exponential backoff for reconnection
      setTimeout(() => {
        this.connectSSE();
      }, this.currentReconnectDelay);

      // Increase delay for next attempt (up to max)
      this.currentReconnectDelay = Math.min(
        this.currentReconnectDelay * 2,
        this.maxReconnectDelay
      );
    };
  }

  /**
   * Start fallback polling
   */
  startPolling() {
    this.pollInterval = setInterval(() => {
      console.log('⏰ Polling for updates...');
      this.loadAll();
    }, this.pollIntervalMs);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Load calendar data
   */
  async loadCalendar() {
    try {
      const response = await fetch('/api/calendar');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      this.setOnline(true);
      this.onCalendarUpdate(data);
    } catch (error) {
      console.error('Error loading calendar:', error);
      this.setOnline(false);
    }
  }

  /**
   * Load meal data
   */
  async loadMeals() {
    try {
      const response = await fetch('/api/meals');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      this.onMealUpdate(data);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  }

  /**
   * Load all data
   */
  async loadAll() {
    await Promise.all([
      this.loadCalendar(),
      this.loadMeals()
    ]);
  }

  /**
   * Stop the update manager
   */
  stop() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.stopPolling();
    console.log('🛑 Update manager stopped');
  }
}

// Export for use in app.js
window.UpdateManager = UpdateManager;
