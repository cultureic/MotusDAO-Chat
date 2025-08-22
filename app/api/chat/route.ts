import { NextRequest } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';

const Body = z.object({ messageText: z.string().min(1), role: z.enum(['user','pro']) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parse = Body.safeParse(json);
  if (!parse.success) return new Response(JSON.stringify({ error: 'bad_request' }), { status: 400 });
  const { messageText, role } = parse.data;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const system = role === 'pro' ? 'You are MotusDAO Professional assistant.' : 'You are MotusDAO User assistant.';
    const chat = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: messageText }] });
    const answer = chat.choices[0]?.message?.content || '';
    return new Response(JSON.stringify({ answer }), { headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    const code = err?.code || err?.status || 'unknown_error';
    const isQuota = code === 'insufficient_quota' || code === 429;
    const fallback = isQuota
      ? 'The AI model is temporarily unavailable due to quota limits. Please try again later.'
      : 'Sorry, something went wrong while generating a response.';
    return new Response(JSON.stringify({ answer: fallback, error: String(code) }), { headers: { 'content-type': 'application/json' }, status: 200 });
  }
}
