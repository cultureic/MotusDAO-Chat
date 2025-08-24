import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                About MotusDAO
              </h1>
              <p className="text-gray-600 mt-2">Revolutionizing AI-powered psychological support</p>
            </div>
            <Link 
              href="/" 
              className="px-6 py-3 bg-white/50 border border-gray-200 rounded-2xl hover:bg-white/80 transition-all duration-300 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  MotusDAO is pioneering the future of AI-powered psychological support by combining 
                  cutting-edge artificial intelligence with blockchain technology. We believe everyone 
                  deserves access to high-quality mental health support, and we're making that vision 
                  a reality through decentralized, secure, and intelligent conversation systems.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our platform leverages the latest advances in AI language models, account abstraction, 
                  and blockchain technology to create a seamless, secure, and accessible mental health 
                  support system.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                    <h3 className="font-semibold text-gray-900 mb-2">🤖 AI-Powered</h3>
                    <p className="text-sm text-gray-600">Advanced language models for intelligent conversations</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                    <h3 className="font-semibold text-gray-900 mb-2">🔐 Secure</h3>
                    <p className="text-sm text-gray-600">Blockchain-based privacy and data protection</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                    <h3 className="font-semibold text-gray-900 mb-2">💎 Decentralized</h3>
                    <p className="text-sm text-gray-600">Community-driven governance and development</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                    <h3 className="font-semibold text-gray-900 mb-2">🌍 Accessible</h3>
                    <p className="text-sm text-gray-600">Available to anyone, anywhere, anytime</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">💬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Intelligent Conversations</h3>
                      <p className="text-sm text-gray-600">AI-powered chat with contextual understanding and emotional intelligence</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">🔐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Smart Account Security</h3>
                      <p className="text-sm text-gray-600">Account abstraction for seamless, secure transactions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">💎</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">CELO Integration</h3>
                      <p className="text-sm text-gray-600">Fast, low-cost transactions on the Celo blockchain</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Professional Mode</h3>
                      <p className="text-sm text-gray-600">Specialized AI responses for professional psychological support</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-200/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Join the Revolution</h2>
                <p className="text-gray-600 mb-4">
                  Be part of the future of mental health support. Experience AI-powered conversations 
                  that understand, support, and guide you through life's challenges.
                </p>
                <Link 
                  href="/chat" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  Start Chatting Now
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
