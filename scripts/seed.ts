import { prisma } from '@/lib/prisma';

async function main() {
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      systemPrompt_user: 'Explain MotusDAO, onboarding, CELO/cUSD payments, privacy... (EN/ES to be added).',
      systemPrompt_pro: 'Support verification, policies, on-chain billing... (EN/ES to be added).'
    }
  });
  console.log('Seeded settings');
}

main().then(()=>process.exit(0)).catch((e)=>{console.error(e);process.exit(1)});
