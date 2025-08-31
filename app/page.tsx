import React from 'react';
import SpacetimeBackground from '@/components/three/SpacetimeBackground';
import { HeroAnimation } from '@/components/three/HeroAnimation';

export default function Page() {
  return (
    <>
      {/* Full-page background animation */}
      <SpacetimeBackground />
      
      <main className="min-h-screen relative z-10">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
          {/* Enhanced Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
          </div>
          
          <div className="relative grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-3 px-6 py-3 backdrop-blur-[20px] bg-white/8 border border-white/15 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
                  <span className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></span>
                  <span className="text-base font-medium text-gray-700 font-jura">AI-Powered Psychology Platform</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-jura text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="text-gray-900">Enhance the pace of</span>
                    <br />
                    <span className="text-indigo-600 italic">Wellness</span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-gray-600 max-w-xl leading-relaxed font-jura">
                    Intelligent conversation with secure CELO payments. Experience the future of AI-powered communication and psychological support.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <a href="/chat" className="group px-10 py-5 backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-2xl text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 inline-flex items-center justify-center text-xl relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] font-jura" style={{filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.15))'}}>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="relative z-10">Start Chat</span>
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a href="/admin" className="px-10 py-5 backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-2xl text-gray-700 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 inline-flex items-center justify-center text-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20 font-jura" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
                  Admin Panel
                </a>
              </div>
              
              {/* Enhanced Stats */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center backdrop-blur-[20px] bg-white/10 border border-white/15 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
                  <div className="text-4xl font-bold text-gray-900 mb-1 font-jura">10K+</div>
                  <div className="text-base text-gray-600 font-medium font-jura">Active Users</div>
                </div>
                <div className="text-center backdrop-blur-[20px] bg-white/10 border border-white/15 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
                  <div className="text-4xl font-bold text-gray-900 mb-1 font-jura">99.9%</div>
                  <div className="text-base text-gray-600 font-medium font-jura">Uptime</div>
                </div>
                <div className="text-center backdrop-blur-[20px] bg-white/10 border border-white/15 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
                  <div className="text-4xl font-bold text-gray-900 mb-1 font-jura">24/7</div>
                  <div className="text-base text-gray-600 font-medium font-jura">Support</div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Enhanced Interactive Demo */}
            <div className="relative h-[400px] lg:h-[520px] backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-3xl overflow-hidden order-1 lg:order-2 transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.15))'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="relative h-full flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                  <HeroAnimation />
                  <div className="space-y-3">
                    <h3 className="text-3xl font-semibold text-gray-900 font-jura">AI Assistant Ready</h3>
                    <p className="text-lg text-gray-600 leading-relaxed font-jura">Start a conversation to experience our advanced AI</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="font-jura text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Why Choose MotusDAO?</h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto font-jura">
              Experience the perfect blend of AI technology and psychological expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
              <div className="w-20 h-20 backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">💬</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-jura">Advanced AI Chat</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-jura">
                State-of-the-art AI models trained specifically for psychological support and meaningful conversations.
              </p>
            </div>
            
            <div className="group backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
              <div className="w-20 h-20 backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🔒</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-jura">Secure Payments</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-jura">
                Pay with CELO cryptocurrency for complete privacy, transparency, and decentralized transactions.
              </p>
            </div>
            
            <div className="group backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
              <div className="w-20 h-20 backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🧠</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-jura">Psychological Expertise</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-jura">
                AI trained on psychological principles to provide supportive and therapeutic conversations.
              </p>
            </div>
            
            <div className="group backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
              <div className="w-20 h-20 backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-jura">Instant Access</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-jura">
                Get immediate support anytime, anywhere. No waiting rooms or scheduling required.
              </p>
            </div>
            
            <div className="group backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
              <div className="w-20 h-20 backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-jura">Progress Tracking</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-jura">
                Monitor your emotional well-being and conversation history with detailed analytics.
              </p>
            </div>
            
            <div className="group backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
              <div className="w-20 h-20 backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🌐</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-jura">Global Community</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-jura">
                Connect with a worldwide community of users and share experiences in a safe environment.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="backdrop-blur-[20px] bg-gradient-to-r from-purple-600/85 via-pink-600/85 to-cyan-600/85 border border-white/25 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]" style={{filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.2))'}}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-4 font-jura">Ready to Start Your Journey?</h2>
              <p className="text-2xl mb-8 opacity-90 max-w-2xl mx-auto font-jura">
                Join thousands of users who have already discovered the power of AI-powered psychological support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/chat" className="px-8 py-4 backdrop-blur-[20px] bg-white/15 border border-white/25 text-white font-medium rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center text-lg hover:bg-white/25 font-jura" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15))'}}>
                  Start Free Trial
                </a>
                <a href="/admin" className="px-8 py-4 backdrop-blur-[20px] bg-white/8 border border-white/20 text-white font-medium rounded-full hover:bg-white/15 transition-all duration-300 inline-flex items-center justify-center text-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] font-jura" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))'}}>
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
              <span className="font-bold text-xl text-gray-900 font-jura">MotusDAO AI</span>
            </div>
            
            <div className="flex space-x-8 text-gray-600">
              <a href="/chat" className="hover:text-gray-900 transition-colors font-jura text-lg">Chat</a>
              <a href="/admin" className="hover:text-gray-900 transition-colors font-jura text-lg">Admin</a>
              <a href="#" className="hover:text-gray-900 transition-colors font-jura text-lg">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors font-jura text-lg">Terms</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-gray-500">
            <p className="font-jura text-lg">&copy; 2024 MotusDAO AI. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
