# Weekplanner v2 - Implementation Plan

## Summary

A new family dashboard for a portrait TV (1080x1920) displaying:
- Google Calendar events from 7+ calendars with live push notifications
- Microsoft Todo integration with configurable lists
- Two-week view with past week context and next week preview

## Technology Stack

- **Backend**: Node.js + Express (like infotavle)
- **Frontend**: Vanilla JavaScript
- **Calendar**: Google Calendar API with push notifications
- **Todo**: Microsoft Graph API for Microsoft Todo (with push notifications)
- **Theming**: Monthly themes (winter, easter, christmas, etc.)
- **Hosting**: Raspberry Pi at https://info.joensen.eu with nginx + Let's Encrypt

## Layout (1080x1920 Portrait)

```
+-----------------------------+
|  THU 30 JAN 2026    14:32   |  Header (~100px)
+-----------------------------+
|                             |
|  UGE 5        | UGE 6       |  Week headers
+-------------+---------------+
|  Mon 27 (faded)| Mon 3      |
|  - event      | - event     |
|  Tue 28 (faded)| Tue 4      |
|  - event      | - event     |
|  Wed 29 (faded)| Wed 5      |
|  - event      | - event     |  Calendar (~1400px)
|  > THU 30 <   | Thu 6       |  - Col 1: Current week
|  - event      | - event     |  - Col 2: Next week
|  Fri 31       | Fri 7       |  - Past days faded
|  - event      | - event     |  - Today highlighted
|  Sat 1        | Sat 8       |  - Day numbers shown
|  - event      | - event     |  - Color-coded events
|  Sun 2        | Sun 9       |
|  - event      | - event     |
+-------------+---------------+
|         TODO LIST           |  Todo Section (~400px)
|  Col 1        | Col 2       |  - Two columns
|  [ ] Groceries| [ ] Laundry |  - Overflow to col 2
|  [ ] Fix bike | [ ] Call mom|  - Microsoft Todo items
+-------------+---------------+
```

## Monthly Themes

| Month | Theme | Colors |
|-------|-------|--------|
| January | Winter | Blue/white |
| February | Valentine | Pink/red |
| March | Spring | Light green |
| April | Easter | Pastel colors |
| May | Spring bloom | Bright green |
| June | Summer | Yellow/orange |
| July | Summer vacation | Beach blue |
| August | Late summer | Warm orange |
| September | Autumn begins | Brown/orange |
| October | Halloween | Orange/black |
| November | Autumn | Deep red/brown |
| December | Christmas | Red/green |
