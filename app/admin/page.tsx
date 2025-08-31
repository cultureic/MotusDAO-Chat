'use client';
import MintHNFT from '../components/MintHNFT';
import SmartAccountInfo from '../components/SmartAccountInfo';
import Link from 'next/link';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-2">Manage your AI platform settings and smart account</p>
            </div>
            <Link 
              href="/" 
              className="px-6 py-3 bg-white/50 border border-gray-200 rounded-2xl hover:bg-white/80 transition-all duration-300 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-lg mb-3">Knowledge Base</h2>
              <p className="text-gray-600 text-sm mb-4">Manage AI training data and knowledge sources</p>
              <div className="text-xs text-gray-500">Coming soon...</div>
            </div>
            <div className="bg-white/50 rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-lg mb-3">Prompts</h2>
              <p className="text-gray-600 text-sm mb-4">Configure AI conversation prompts and responses</p>
              <div className="text-xs text-gray-500">Coming soon...</div>
            </div>
            <div className="bg-white/50 rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-lg mb-3">System Logs</h2>
              <p className="text-gray-600 text-sm mb-4">View system activity and error logs</p>
              <div className="text-xs text-gray-500">Coming soon...</div>
            </div>
            <div className="bg-white/50 rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-lg mb-3">User Consents</h2>
              <p className="text-gray-600 text-sm mb-4">Manage user consent and privacy settings</p>
              <div className="text-xs text-gray-500">Coming soon...</div>
            </div>
            <div className="bg-white/50 rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-lg mb-3">Smart Account</h2>
              <p className="text-gray-600 text-sm mb-4">Your AA wallet for gasless transactions</p>
              <SmartAccountInfo />
            </div>
            <div className="bg-white/50 rounded-2xl border border-white/30 p-6 backdrop-blur-sm">
              <h2 className="font-semibold text-lg mb-3">HNFT Management</h2>
              <p className="text-gray-600 text-sm mb-4">Mint and manage your Human NFT</p>
              <MintHNFT />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
