import { NextResponse } from 'next/server';
import Ably from 'ably';

const ablyApiKey = process.env.ABLY_API_KEY;
const ablyClientId = process.env.ABLY_CLIENT_ID;

if (!ablyApiKey || !ablyClientId) {
  console.error('ABLY_API_KEY or ABLY_CLIENT_ID is not set');
}

const ably = new Ably.Realtime({ key: ablyApiKey });

export async function GET() {
  try {
    const tokenRequest = await ably.auth.createTokenRequest({ clientId: ablyClientId });
    const token = await ably.auth.requestToken(tokenRequest);
    return NextResponse.json(token, { status: 200 });
  } catch (err) {
    console.error('Error requesting token:', err);
    return new NextResponse('Error requesting token: ' + err, { status: 500 });
  }
}
