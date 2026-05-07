const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNWWFcRwGwEB5F4E36QRwL5mVxwXMlp9IBXTzub4c9bWaPs9UUTzM6vmCVDxeQnNwv1w/exec';

  try {
    const data = await new Promise((resolve, reject) => {
      https.get(SCRIPT_URL, { headers: { 'Accept': 'application/json' } }, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          https.get(response.headers.location, (res2) => {
            let body = '';
            res2.on('data', chunk => body += chunk);
            res2.on('end', () => resolve(JSON.parse(body)));
          }).on('error', reject);
          return;
        }
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
