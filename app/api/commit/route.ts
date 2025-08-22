import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  // TODO: AA sponsor commit to DataPointerRegistry
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}
