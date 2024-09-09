import { NextResponse } from 'next/server';
import Ably from 'ably';

const ablyApiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
const ablyClientId = process.env.NEXT_PUBLIC_ABLY_CLIENT_ID;

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
