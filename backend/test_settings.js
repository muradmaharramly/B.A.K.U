require('dotenv').config();
const http = require('http');

// First get a valid token by logging in
const loginData = JSON.stringify({ username: 'admin', password: 'admin123' });

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Login response:', data);
      const token = parsed.token;
      if (!token) return console.error('No token received');

      // Now test PUT /api/settings
      const settingsData = JSON.stringify({ currency: 'azn', language: 'az' });
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/settings',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': settingsData.length,
          'Authorization': `Bearer ${token}`
        }
      };

      const req = http.request(options, (res2) => {
        let d = '';
        res2.on('data', (chunk) => d += chunk);
        res2.on('end', () => console.log('PUT /settings response:', res2.statusCode, d));
      });
      req.on('error', (e) => console.error('Request error:', e.message));
      req.write(settingsData);
      req.end();
    } catch (e) {
      console.error('Parse error:', e.message, data);
    }
  });
});
loginReq.on('error', (e) => console.error('Login error:', e.message));
loginReq.write(loginData);
loginReq.end();
