import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  // TODO: Auth + AA sponsor call to ChatPay
  return new Response(JSON.stringify({ ok: true, userOpHash: '0x', txHash: null }), { headers: { 'content-type': 'application/json' } });
}
