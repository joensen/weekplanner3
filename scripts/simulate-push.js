#!/usr/bin/env node
/**
 * Simulate Push Events - CLI tool for testing push notifications
 *
 * Usage:
 *   node scripts/simulate-push.js calendar    # Simulate calendar push
 *   node scripts/simulate-push.js todo        # Simulate todo push
 *   node scripts/simulate-push.js all         # Refresh all data
 *   node scripts/simulate-push.js status      # Check simulation status
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function simulateCalendarPush() {
  console.log('📅 Simulating calendar push notification...');
  try {
    const response = await fetch(`${BASE_URL}/api/simulate/calendar-push`, {
      method: 'POST'
    });
    const data = await response.json();
    console.log('✅', data.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function simulateTodoPush() {
  console.log('📋 Simulating todo push notification...');
  try {
    const response = await fetch(`${BASE_URL}/api/simulate/todo-push`, {
      method: 'POST'
    });
    const data = await response.json();
    console.log('✅', data.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function refreshAll() {
  console.log('🔄 Regenerating all mock data...');
  try {
    const response = await fetch(`${BASE_URL}/api/simulate/refresh-all`, {
      method: 'POST'
    });
    const data = await response.json();
    console.log('✅', data.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function getStatus() {
  console.log('📊 Checking simulation status...');
  try {
    const response = await fetch(`${BASE_URL}/api/simulate/status`);
    const data = await response.json();
    console.log('Status:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Main
const command = process.argv[2];

switch (command) {
  case 'calendar':
    simulateCalendarPush();
    break;
  case 'todo':
    simulateTodoPush();
    break;
  case 'all':
    refreshAll();
    break;
  case 'status':
    getStatus();
    break;
  default:
    console.log(`
Simulate Push Events - CLI tool for testing

Usage:
  node scripts/simulate-push.js <command>

Commands:
  calendar   Simulate a Google Calendar push notification
  todo       Simulate a Microsoft Todo push notification
  all        Regenerate all mock data and notify clients
  status     Check simulation status

Examples:
  node scripts/simulate-push.js calendar
  node scripts/simulate-push.js all

Note: Server must be running with MOCK_MODE=true
    `);
}
