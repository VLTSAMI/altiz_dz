export async function onRequest(context) {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNWWFcRwGwEB5F4E36QRwL5mVxwXMlp9IBXTzub4c9bWaPs9UUTzM6vmCVDxeQnNwv1w/exec';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers
    });
  }
}
