const { NodeCache } = require('@cacheable/node-cache');
const config = require('../config/config');
const mockDataService = require('./mockDataService');

// Initialize cache with TTL from config
const cache = new NodeCache({ stdTTL: config.cache.todoTTL / 1000 });

class TodoService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.initialized = false;
    this.cache = cache;
    this.mockMode = process.env.MOCK_MODE === 'true';
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getAccessToken() {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Refresh the token
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const refreshToken = process.env.MICROSOFT_REFRESH_TOKEN;
    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';

    if (!clientId || !clientSecret || !refreshToken) {
      console.error('Microsoft credentials not configured');
      return null;
    }

    try {
      const response = await fetch(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            scope: 'https://graph.microsoft.com/Tasks.Read https://graph.microsoft.com/Tasks.Read.Shared offline_access'
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Token refresh failed:', errorData);
        return null;
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Token expires in ~1 hour, set expiry with 5 min buffer
      this.tokenExpiry = new Date(Date.now() + (data.expires_in - 300) * 1000);
      this.initialized = true;

      console.log('Microsoft Graph token refreshed successfully');
      return this.accessToken;
    } catch (error) {
      console.error('Error refreshing Microsoft token:', error);
      return null;
    }
  }

  /**
   * Fetch tasks from a specific list
   */
  async fetchTasksFromList(listConfig) {
    const token = await this.getAccessToken();
    if (!token) {
      return [];
    }

    try {
      // Fetch only incomplete tasks
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/todo/lists/${listConfig.id}/tasks?$filter=status ne 'completed'&$orderby=importance desc,createdDateTime desc`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching tasks from ${listConfig.name}:`, errorText);
        return [];
      }

      const data = await response.json();
      const tasks = data.value || [];

      console.log(`✓ Fetched ${tasks.length} incomplete tasks from ${listConfig.name}`);

      // Map tasks to our format
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDateTime ? task.dueDateTime.dateTime.split('T')[0] : null,
        importance: task.importance,
        listId: listConfig.id,
        listName: listConfig.name,
        listColor: listConfig.color
      }));
    } catch (error) {
      console.error(`✗ Error fetching tasks from ${listConfig.name}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch all tasks from configured lists
   */
  async fetchAllTasks() {
    // Mock mode: return simulated data
    if (this.mockMode) {
      const cachedData = cache.get('all_tasks');
      if (cachedData) {
        console.log('Returning cached mock todo data');
        return cachedData;
      }

      console.log('🎭 Generating mock todo data...');
      const mockData = mockDataService.generateTodoData();
      cache.set('all_tasks', mockData);
      return mockData;
    }

    // Check cache first
    const cachedData = cache.get('all_tasks');
    if (cachedData) {
      console.log('Returning cached todo data');
      return cachedData;
    }

    // Check if Microsoft credentials are configured
    if (!process.env.MICROSOFT_CLIENT_ID) {
      console.log('Microsoft Todo not configured, returning empty list');
      console.log('💡 Tip: Set MOCK_MODE=true in .env to use simulated data');
      return { tasks: [], lastUpdated: new Date().toISOString() };
    }

    console.log('Fetching fresh todo data from Microsoft Graph API...');

    try {
      // Fetch tasks from the configured list
      const tasks = await this.fetchTasksFromList(config.todoList);

      // Sort: high importance first, then by due date (soonest first), then by title
      tasks.sort((a, b) => {
        // Importance: high > normal > low
        const importanceOrder = { high: 0, normal: 1, low: 2 };
        const impA = importanceOrder[a.importance] || 1;
        const impB = importanceOrder[b.importance] || 1;
        if (impA !== impB) return impA - impB;

        // Due date (null = no due date = last)
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && b.dueDate) {
          const dateCompare = a.dueDate.localeCompare(b.dueDate);
          if (dateCompare !== 0) return dateCompare;
        }

        // Finally by title
        return a.title.localeCompare(b.title);
      });

      const result = {
        tasks: tasks,
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      cache.set('all_tasks', result);
      console.log(`Fetched ${tasks.length} tasks`);

      return result;
    } catch (error) {
      console.error('Error fetching todos:', error.message);

      // Fallback to cached data
      const cachedData = cache.get('all_tasks');
      if (cachedData) {
        console.log('Returning expired cached data due to error');
        return cachedData;
      }

      return { tasks: [], lastUpdated: new Date().toISOString() };
    }
  }
}

module.exports = new TodoService();
