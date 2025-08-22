import { NextRequest } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';

const Body = z.object({ messageText: z.string().min(1), role: z.enum(['user','pro']) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parse = Body.safeParse(json);
  if (!parse.success) return new Response(JSON.stringify({ error: 'bad_request' }), { status: 400 });
  const { messageText, role } = parse.data;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const system = role === 'pro' ? 'You are MotusDAO Professional assistant.' : 'You are MotusDAO User assistant.';
  const chat = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: messageText }] });
  const answer = chat.choices[0]?.message?.content || '';

  return new Response(JSON.stringify({ answer }), { headers: { 'content-type': 'application/json' } });
}
