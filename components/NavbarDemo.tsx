'use client';

import RoundedTransparentNavbar from './RoundedTransparentNavbar';

export default function NavbarDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <RoundedTransparentNavbar />

      {/* Content */}
      <div className="relative z-10 pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 bg-clip-text text-transparent mb-8">
            Rounded Transparent Navbar
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            A modern, glassmorphism-style navbar with rounded corners, transparency effects, and smooth animations.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Glassmorphism Design</h3>
              <p className="text-gray-600">Beautiful transparent effects with backdrop blur for a modern look.</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rounded Corners</h3>
              <p className="text-gray-600">Smooth rounded corners throughout the interface for a friendly feel.</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smooth Animations</h3>
              <p className="text-gray-600">Fluid animations and transitions powered by Framer Motion.</p>
            </div>
          </div>

          {/* Scroll Demo */}
          <div className="mt-20 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Scroll to see the navbar adapt</h2>
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Section {i + 1}</h3>
                  <p className="text-gray-600">
                    This is a demo section to show how the navbar changes transparency and shadow when scrolling.
                    The navbar becomes more opaque and gets a stronger shadow as you scroll down.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
