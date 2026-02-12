/**
 * One-time script to get OAuth refresh token for Google Calendar
 *
 * Usage:
 * 1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
 * 2. Run: node scripts/getRefreshToken.js
 * 3. Open the URL in your browser and authorize
 * 4. Copy the refresh token to your .env file
 */

require('dotenv').config();
const { google } = require('googleapis');
const http = require('http');
const url = require('url');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.trim();
const REDIRECT_URI = 'http://localhost:3000/oauth/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env');
  console.log('\nAdd these to your .env file:');
  console.log('GOOGLE_CLIENT_ID=your_client_id_here');
  console.log('GOOGLE_CLIENT_SECRET=your_client_secret_here');
  process.exit(1);
}

// Debug: show partial credentials
console.log('Using Client ID:', CLIENT_ID.substring(0, 20) + '...');
console.log('Client Secret length:', CLIENT_SECRET.length, 'chars');

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/calendar.readonly']
});

console.log('\n=== Google Calendar OAuth Setup ===\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in and authorize the application');
console.log('3. You will be redirected - the token will be captured automatically\n');

// Start temporary server to capture the callback
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/oauth/callback') {
    const code = parsedUrl.query.code;

    if (code) {
      try {
        const { tokens } = await oauth2Client.getToken(code);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: sans-serif; padding: 40px; text-align: center;">
              <h1 style="color: green;">Success!</h1>
              <p>You can close this window and check the terminal.</p>
            </body>
          </html>
        `);

        console.log('\n=== SUCCESS! ===\n');
        console.log('Add this to your .env file:\n');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log('\n================\n');

        server.close();
        process.exit(0);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error getting tokens: ' + error.message);
        console.error('Error:', error.message);
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('No authorization code received');
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Waiting for authorization callback on http://localhost:3000...\n');
});
