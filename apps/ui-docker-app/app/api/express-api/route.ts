

import axios from 'axios';

export async function POST(request: Request) {

  const body = await request.json();

  const url = body?.url || 'http://api:3333/api';

  try {
    const apiRes = await axios.get(url);

    return new Response(JSON.stringify(apiRes.data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error:any) {
    console.error('Error accessing API:', error?.message || '');
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: (error?.response?.status) || 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}