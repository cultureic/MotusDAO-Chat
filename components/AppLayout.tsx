"use client";

import React, { useMemo } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSmartAccount } from '@/lib/smart-account';
import dynamic from 'next/dynamic';

const HoloRibbon = dynamic(() => import('./HoloRibbon'), { ssr: false });

const AppLayout = () => {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { eoaAddress, smartAccountAddress } = useSmartAccount();

  const address = useMemo(() => wallets[0]?.address, [wallets]);

  const handleAuthClick = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  const getDisplayText = () => {
    if (!ready) return "Loading...";
    if (authenticated) {
      return "Sign Out";
    }
    return "Sign In";
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl lg:text-2xl">🤖</span>
            <span className="font-bold text-lg lg:text-xl font-semibold text-gray-900">MotusDAO AI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/chat" className="text-gray-600 hover:text-gray-900 transition-colors text-base">Chat</a>
            <a href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors text-base">Admin</a>
          </div>
          
          <div className="flex items-center space-x-4">
            {authenticated && (
              <div className="hidden lg:flex flex-col space-y-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500">EOA:</span>
                  <span className="font-mono font-medium text-gray-900">
                    {eoaAddress ? `${eoaAddress.slice(0, 6)}…${eoaAddress.slice(-4)}` : 'Connecting...'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500">Smart Account:</span>
                  <span className="font-mono font-medium text-gray-900">
                    {smartAccountAddress ? `${smartAccountAddress.slice(0, 6)}…${smartAccountAddress.slice(-4)}` : 'Generating...'}
                  </span>
                </div>
              </div>
            )}
            <button 
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-base ${
                authenticated 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-900 shadow-sm hover:bg-gray-50'
              }`}
              onClick={handleAuthClick}
              disabled={!ready}
            >
              {getDisplayText()}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <h1 className="font-bold tracking-tight text-[clamp(40px,7vw,88px)] leading-[0.9] bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MotusDAO AI Chat
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Intelligent conversation with secure CELO payments. Experience the future of AI-powered communication.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/chat" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center text-base">
                Start Chat
              </a>
              <a href="/admin" className="px-8 py-4 border border-gray-200 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-colors inline-flex items-center justify-center text-base">
                Admin Panel
              </a>
            </div>
          </div>
          
          {/* Right Column - Optional Holo Accent */}
          <div className="h-[400px] lg:h-[520px] rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden order-1 lg:order-2">
            {/* Optional Holographic Accent */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Chat</h3>
            <p className="text-gray-600 leading-relaxed">Intelligent conversation with advanced AI models</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
            <p className="text-gray-600 leading-relaxed">Pay with CELO cryptocurrency for privacy and transparency</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin Panel</h3>
            <p className="text-gray-600 leading-relaxed">Manage conversations, settings, and system configuration</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mx-auto max-w-7xl px-6 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-lg font-semibold text-gray-900">MotusDAO AI</span>
          </div>
          
          <div className="flex space-x-8 text-gray-600">
            <a href="/chat" className="hover:text-gray-900 transition-colors">Chat</a>
            <a href="/admin" className="hover:text-gray-900 transition-colors">Admin</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
