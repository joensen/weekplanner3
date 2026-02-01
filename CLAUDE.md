# Weekplanner3 - Developer Guide

## Overview
Family dashboard displaying Google Calendar events on a portrait TV (1080x1920).

## Quick Start
```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your API keys and calendar IDs

# Start development server
npm run dev

# Start production server
npm start
```

## Project Structure
```
weekplanner3/
├── server/
│   ├── server.js           # Express entry point with SSE
│   ├── config/config.js    # Calendars, themes
│   ├── routes/             # API endpoints
│   └── services/           # Google Calendar
├── public/
│   ├── index.html          # Main page
│   ├── css/styles.css      # Portrait layout styles
│   └── js/                 # Frontend components
└── scripts/                # Deployment scripts
```

## Key Endpoints
- `GET /api/calendar` - Merged calendar events for 2 weeks
- `GET /api/events-stream` - SSE for real-time updates
- `POST /api/webhook/calendar` - Google Calendar push notifications

## Adding Calendars
1. Get calendar ID from Google Calendar settings
2. Add to `.env`: `CALENDAR_ID_X=calendar_id_here`
3. Configure in `server/config/config.js` with color and name

## Push Notifications Setup
Requires HTTPS with valid certificate (see PLAN.md for nginx setup).

## Monthly Themes
Themes auto-switch based on current month. Edit `server/config/config.js` or `public/js/themeManager.js` to customize colors.
