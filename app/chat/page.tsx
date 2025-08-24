'use client';
import { useState } from 'react';

type Role = 'user' | 'pro';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

interface Message {
  role: string;
  text: string;
  txHash?: string;
  userOpHash?: string;
  timestamp?: number;
}

export default function ChatPage() {
  const [role, setRole] = useState<Role>('user');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTxHistory, setShowTxHistory] = useState(true);

  // Get payment amount from environment (in CELO)
  const getPaymentAmount = () => {
    const priceWei = process.env.NEXT_PUBLIC_PRICE_PER_MESSAGE_NATIVE_WEI || "2000000000000000";
    const priceInCELO = BigInt(priceWei) / BigInt(10 ** 18);
    return priceInCELO.toString();
  };

  async function onSend() {
    if (!input.trim() || isProcessing) return;
    
    const text = input;
    setInput('');
    setIsProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      // Step 1: Process payment
      console.log('Processing payment for message:', text);
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentRes = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messageId })
      });

      const paymentData = await paymentRes.json();
      
      if (!paymentRes.ok) {
        throw new Error(paymentData.error || 'Payment failed');
      }

      if (!paymentData.ok) {
        throw new Error('Payment processing failed');
      }

      console.log('Payment successful:', paymentData);
      setPaymentStatus('success');

      // Log transaction details for debugging
      if (paymentData.userOpHash && paymentData.userOpHash !== '0x_no_userop_hash') {
        console.log('🎉 Transaction Generated!');
        console.log('📋 UserOp Hash:', paymentData.userOpHash);
        console.log('🔗 Explorer Link:', `https://alfajores.celoscan.io/tx/${paymentData.userOpHash}`);
        if (paymentData.txHash && paymentData.txHash !== '0x_no_tx_hash') {
          console.log('📋 Transaction Hash:', paymentData.txHash);
          console.log('🔗 Transaction Link:', `https://alfajores.celoscan.io/tx/${paymentData.txHash}`);
        }
      }

      // Step 2: Add user message to chat with payment info
      setMessages((m) => [...m, { 
        role: 'me', 
        text: text,
        userOpHash: paymentData.userOpHash,
        txHash: paymentData.txHash,
        timestamp: Date.now()
      }]);

      // Step 3: Get AI response
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messageText: text, role })
      });

      const chatData = await chatRes.json();
      
      if (!chatRes.ok) {
        throw new Error('Failed to get AI response');
      }

      setMessages((m) => [...m, { role: 'ai', text: chatData.answer ?? 'ok' }]);
      setPaymentStatus('idle');

    } catch (e: any) {
      console.error('Error in chat flow:', e);
      setError(e.message || 'Failed to process message. Please try again.');
      setPaymentStatus('error');
      
      // Add user message back to input if payment failed
      setInput(text);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Function to copy transaction hash to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard:', text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Compact Header */}
        <div className="mb-6">
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Chat Assistant
                  </h1>
                  <p className="text-sm text-gray-600">Secure CELO-powered conversations</p>
                </div>
              </div>
              
              {/* Role Selection */}
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    console.log('User mode clicked, current role:', role);
                    setRole('user');
                  }} 
                  className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-medium text-sm ${
                    role === 'user'
                      ? 'shadow-lg font-semibold'
                      : 'bg-white/50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-white/80'
                  }`}
                  style={role === 'user' ? {
                    background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                    color: 'white',
                    borderColor: 'transparent',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  } : {}}
                  disabled={false}
                >
                  👤 User
                </button>
                <button 
                  onClick={() => {
                    console.log('Professional mode clicked, current role:', role);
                    setRole('pro');
                  }} 
                  className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-medium text-sm ${
                    role === 'pro'
                      ? 'shadow-lg font-semibold'
                      : 'bg-white/50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-white/80'
                  }`}
                  style={role === 'pro' ? {
                    background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                    color: 'white',
                    borderColor: 'transparent',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  } : {}}
                  disabled={false}
                >
                  🎯 Professional
                </button>
              </div>
              
              {/* Status and Price */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-200/50">
                  <div className="text-lg font-bold text-gray-900">{getPaymentAmount()}</div>
                  <div className="text-xs text-gray-600">CELO</div>
                </div>
                <button
                  onClick={() => setShowTxHistory(!showTxHistory)}
                  className="px-3 py-2 bg-white/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-white/80 transition-all duration-300"
                >
                  {showTxHistory ? '📋 Hide' : '📋 History'}
                </button>
              </div>
            </div>
            
            {/* Warning */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-amber-600">⚠️</span>
                <span className="text-amber-800 text-xs">This is not clinical advice. For medical concerns, please consult a healthcare professional.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Area - Takes up more space */}
          <div className="lg:col-span-3">
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden"
            >
              {/* Status Messages */}
              <div className="p-4 border-b border-gray-100">
                {error && (
                  <div 
                    className="p-3 rounded-xl bg-red-50 border border-red-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">⚠️</span>
                      <span className="text-red-800 text-sm">{error}</span>
                    </div>
                  </div>
                )}
                
                {paymentStatus === 'processing' && (
                  <div 
                    className="p-3 rounded-xl bg-blue-50 border border-blue-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                      />
                      <span className="text-blue-800 text-sm">Processing payment...</span>
                    </div>
                  </div>
                )}
                
                {paymentStatus === 'success' && (
                  <div 
                    className="p-3 rounded-xl bg-green-50 border border-green-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span className="text-green-800 text-sm">Payment successful! Getting AI response...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="h-[65vh] overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Start a Conversation</h3>
                      <p className="text-sm text-gray-600">Send a message to begin chatting</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${message.role === 'me' ? 'order-2' : 'order-1'}`}>
                          <div className={`p-4 rounded-2xl ${
                            message.role === 'me' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : 'bg-white/90 border border-gray-200 text-gray-900'
                          }`}>
                            <div className="flex items-start space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                message.role === 'me' ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                              }`}>
                                {message.role === 'me' ? '👤' : '🤖'}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs opacity-80 mb-2">
                                  {message.role === 'me' ? 'You' : 'AI Assistant'}
                                </div>
                                <div className="leading-relaxed text-sm">{message.text}</div>
                                
                                {/* Transaction Info */}
                                {(message.userOpHash || message.txHash) && (
                                  <div className="mt-3 p-2 rounded-lg bg-black/10">
                                    {message.txHash && message.txHash !== '0x_no_tx_hash' ? (
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs opacity-70">Transaction:</span>
                                          <button
                                            onClick={() => copyToClipboard(message.txHash!)}
                                            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                                          >
                                            📋 Copy
                                          </button>
                                        </div>
                                        <div className="font-mono text-xs break-all">
                                          {message.txHash.slice(0, 12)}...{message.txHash.slice(-6)}
                                        </div>
                                        <a 
                                          href={`https://alfajores.celoscan.io/tx/${message.txHash}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs underline hover:opacity-80 transition-opacity"
                                        >
                                          View Transaction →
                                        </a>
                                      </div>
                                    ) : message.userOpHash && message.userOpHash !== '0x_no_userop_hash' ? (
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs opacity-70">Operation:</span>
                                          <button
                                            onClick={() => copyToClipboard(message.userOpHash!)}
                                            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                                          >
                                            📋 Copy
                                          </button>
                                        </div>
                                        <div className="font-mono text-xs break-all">
                                          {message.userOpHash.slice(0, 12)}...{message.userOpHash.slice(-6)}
                                        </div>
                                        <a 
                                          href={`https://alfajores.celoscan.io/address/0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs underline hover:opacity-80 transition-opacity"
                                        >
                                          View Contract →
                                        </a>
                                      </div>
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isProcessing ? "Processing payment..." : "Type your message here..."}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm"
                    disabled={isProcessing}
                  />
                  <button 
                    onClick={onSend}
                    disabled={isProcessing || !input.trim()}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isProcessing || !input.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                        />
                        <span className="text-sm">Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Send</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History Sidebar */}
          <div className="lg:col-span-1">
            {showTxHistory && (
              <div 
                className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-4"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
                <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded-lg">
                  💡 <strong>Tip:</strong> Click "View Contract" to see all transactions in the smart contract's internal transactions tab.
                </div>
                <div className="space-y-3 max-h-[65vh] overflow-y-auto">
                  {messages
                    .filter(m => m.userOpHash && m.userOpHash !== '0x_no_userop_hash')
                    .map((message, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50"
                      >
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">{message.role === 'me' ? 'You' : 'AI'}:</span> {message.text.slice(0, 40)}...
                          </div>
                          <div className="space-y-1">
                            {message.txHash && message.txHash !== '0x_no_tx_hash' ? (
                              <div className="text-xs">
                                <span className="text-gray-500">Transaction: </span>
                                <span className="font-mono text-pink-600">{message.txHash?.slice(0, 12)}...</span>
                              </div>
                            ) : (
                              <div className="text-xs">
                                <span className="text-gray-500">Operation: </span>
                                <span className="font-mono text-purple-600">{message.userOpHash?.slice(0, 12)}...</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {message.txHash && message.txHash !== '0x_no_tx_hash' ? (
                              <a 
                                href={`https://alfajores.celoscan.io/tx/${message.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-pink-600 hover:text-pink-800 underline"
                              >
                                View Transaction
                              </a>
                            ) : (
                              <a 
                                href={`https://alfajores.celoscan.io/address/0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 hover:text-purple-800 underline"
                              >
                                View Contract
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  {messages.filter(m => m.userOpHash && m.userOpHash !== '0x_no_userop_hash').length === 0 && (
                    <div 
                      className="text-center py-6 text-gray-500"
                    >
                      <div className="text-2xl mb-2">📋</div>
                      <div className="text-xs">No transactions yet. Send a message to see the history.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
