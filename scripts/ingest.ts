import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

const [, , filePath, namespace = 'kb_users'] = process.argv;
if (!filePath) throw new Error('Usage: pnpm ingest <path> [namespace]');

async function main() {
  const text = fs.readFileSync(path.resolve(filePath), 'utf8');
  const title = path.basename(filePath);
  const doc = await prisma.doc.create({ data: { title, source: filePath, namespace } });
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += 700) chunks.push(text.slice(i, i + 800));
  for (let i = 0; i < chunks.length; i++) {
    await prisma.chunk.create({ data: { docId: doc.id, content: chunks[i], embedding: undefined as any, chunkIndex: i } });
  }
  console.log(`Ingested ${chunks.length} chunks into ${namespace}`);
}

main().then(()=>process.exit(0)).catch((e)=>{console.error(e);process.exit(1)});
