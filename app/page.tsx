import Link from 'next/link';
export default function Page() {
  return (
    <main className="flex flex-col items-center gap-6 py-24">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-10 text-center max-w-2xl">
        <h1 className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">Talk with MotusDAO AI</h1>
        <p className="mt-3 opacity-80">Bilingual, role-aware chat with on-chain privacy and payments.</p>
        <div className="mt-8">
          <Link href="/chat" className="px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30">Start chatting</Link>
        </div>
      </div>
    </main>
  );
}
