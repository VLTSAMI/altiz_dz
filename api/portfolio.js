export default async function handler(req, res) {
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNWWFcRwGwEB5F4E36QRwL5mVxwXMlp9IBXTzub4c9bWaPs9UUTzM6vmCVDxeQnNwv1w/exec';

  try {
    const response = await fetch(SCRIPT_URL, {
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Google Script returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
