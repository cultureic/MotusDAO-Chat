'use client';
import MintHNFT from '../components/MintHNFT';
import SmartAccountInfo from '../components/SmartAccountInfo';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <Link 
          href="/" 
          className="px-4 py-2 rounded-xl border hover:bg-white/10 text-sm"
        >
          ← Back to Main Menu
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border p-4">Knowledge (stub)</div>
        <div className="rounded-2xl border p-4">Prompts (stub)</div>
        <div className="rounded-2xl border p-4">Logs (stub)</div>
        <div className="rounded-2xl border p-4">Consents (stub)</div>
        <div className="rounded-2xl border p-4">Settings (stub)</div>
        <div className="rounded-2xl border p-4">
          <h2 className="font-medium mb-2">Smart Account</h2>
          <p className="opacity-70 text-sm mb-3">Your AA wallet for gasless transactions.</p>
          <SmartAccountInfo />
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="font-medium mb-2">On-chain</h2>
          <p className="opacity-70 text-sm mb-3">Mint and manage your HNFT.</p>
          <MintHNFT />
        </div>
      </div>
    </div>
  );
}
