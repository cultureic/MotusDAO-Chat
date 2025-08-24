import React from 'react';

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">AI-Powered Psychology Platform</span>
              </div>
              
              <h1 className="font-bold tracking-tight text-[clamp(40px,7vw,88px)] leading-[0.9] bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                MotusDAO AI Chat
              </h1>
              
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                Intelligent conversation with secure CELO payments. Experience the future of AI-powered communication and psychological support.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/chat" className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center text-base">
                <span>Start Chat</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="/admin" className="px-8 py-4 border border-gray-200 text-gray-900 font-medium rounded-full hover:bg-white/50 hover:border-gray-300 transition-all duration-300 inline-flex items-center justify-center text-base backdrop-blur-sm">
                Admin Panel
              </a>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Interactive Demo */}
          <div className="relative h-[400px] lg:h-[520px] rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-2xl overflow-hidden order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🤖</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">AI Assistant Ready</h3>
                  <p className="text-gray-600">Start a conversation to experience our advanced AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MotusDAO?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of AI technology and psychological expertise
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced AI Chat</h3>
            <p className="text-gray-600 leading-relaxed">
              State-of-the-art AI models trained specifically for psychological support and meaningful conversations.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
            <p className="text-gray-600 leading-relaxed">
              Pay with CELO cryptocurrency for complete privacy, transparency, and decentralized transactions.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Psychological Expertise</h3>
            <p className="text-gray-600 leading-relaxed">
              AI trained on psychological principles to provide supportive and therapeutic conversations.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Access</h3>
            <p className="text-gray-600 leading-relaxed">
              Get immediate support anytime, anywhere. No waiting rooms or scheduling required.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your emotional well-being and conversation history with detailed analytics.
            </p>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with a worldwide community of users and share experiences in a safe environment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who have already discovered the power of AI-powered psychological support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/chat" className="px-8 py-4 bg-white text-purple-600 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center text-base">
                Start Free Trial
              </a>
              <a href="/admin" className="px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center text-base">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mx-auto max-w-7xl px-6 py-12 border-t border-white/20">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-gray-900">MotusDAO AI</span>
          </div>
          
          <div className="flex space-x-8 text-gray-600">
            <a href="/chat" className="hover:text-gray-900 transition-colors">Chat</a>
            <a href="/admin" className="hover:text-gray-900 transition-colors">Admin</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-gray-500">
          <p>&copy; 2024 MotusDAO AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
