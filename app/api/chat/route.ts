import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const role = body.role === 'pro' ? 'pro' : 'user';
  const messageText: string = body.messageText ?? '';
  // TODO: RAG and prompts by role; placeholder response
  const answer = role === 'pro' ? `PRO: ${messageText}` : `USER: ${messageText}`;
  return new Response(JSON.stringify({ answer }), { headers: { 'content-type': 'application/json' } });
}
