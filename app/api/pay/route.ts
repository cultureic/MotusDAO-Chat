import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { PRICE_PER_MESSAGE_PRO, PRICE_PER_MESSAGE_USER } from '@/lib/constants';

const Body = z.object({ messageId: z.string().min(1), amount: z.string().or(z.number()), chain: z.string().optional(), role: z.enum(['user','pro']) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parse = Body.safeParse(json);
  if (!parse.success) return new Response(JSON.stringify({ error: 'bad_request' }), { status: 400 });
  const { messageId, role } = parse.data;

  // Gate pricing
  const expected = role === 'pro' ? PRICE_PER_MESSAGE_PRO : PRICE_PER_MESSAGE_USER;

  // TODO: Privy auth + AA sponsor + hasTrait checks + HNFT
  const userId = 'dev-user';

  const log = await prisma.paymentLog.create({ data: {
    userId,
    messageIdRef: messageId,
    amountDecimal: expected,
    status: 'initiated'
  }});

  return new Response(JSON.stringify({ ok: true, paymentId: log.id, userOpHash: '0x', txHash: null }), { headers: { 'content-type': 'application/json' } });
}
