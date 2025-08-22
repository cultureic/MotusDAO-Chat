import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const Body = z.object({ messageHash: z.string().min(2), cid: z.string().min(3) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parse = Body.safeParse(json);
  if (!parse.success) return new Response(JSON.stringify({ error: 'bad_request' }), { status: 400 });

  // TODO: sponsor commit to DataPointerRegistry

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}
