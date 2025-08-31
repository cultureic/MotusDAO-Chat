'use client';
import { useState, useEffect } from 'react';
import { LLMWithFilecoinProvider, useLLMWithFilecoin } from '../../hooks/useLLMWithFilecoin';
import { FilecoinQueryPanel } from '../../components/FilecoinQueryPanel';
import { Transfer } from '../../components/Transfer';
import { useSmartAccount } from '@/lib/smart-account';
import { useWallets, useSendTransaction } from '@privy-io/react-auth';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

type Role = 'user' | 'pro';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';
type PaymentMode = 'smart-account' | 'user-wallet';
type TransactionRecord = {
  id: string;
  messageText: string;
  hash: string;
  paymentMode: PaymentMode;
  timestamp: Date;
  status: 'pending' | 'success' | 'failed';
};

// Chat component that uses the LLM hook
function ChatComponent() {
  const {
    currentSession,
    addMessage,
    chatComplete,
    loading: llmLoading,
    error: llmError,
    model,
    changeModel,
    filecoinConnected,
    lastSyncStatus,
    saveCurrentConversation
  } = useLLMWithFilecoin();

  const [role, setRole] = useState<Role>('user');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('smart-account');
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFilecoinPanel, setShowFilecoinPanel] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [eoaBalance, setEoaBalance] = useState<string>('0');
  const [smartAccountBalance, setSmartAccountBalance] = useState<string>('0');
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  // Get user account information
  const { 
    userType, 
    primaryAddress, 
    userId, 
    isAuthenticated, 
    userEmail,
    eoaAddress,
    smartAccountAddress 
  } = useSmartAccount();

  // Get user wallets for signing transactions
  const { wallets } = useWallets();
  
  // Get Privy's sendTransaction hook for native smart account transactions
  const { sendTransaction } = useSendTransaction();

  // Get payment amount from environment (in CELO)
  const getPaymentAmount = () => {
    const priceWei = process.env.NEXT_PUBLIC_PRICE_PER_MESSAGE_NATIVE_WEI || "2000000000000000";
    const priceInCELO = BigInt(priceWei) / BigInt(10 ** 18);
    return priceInCELO.toString();
  };

  // Fetch CELO balances
  const fetchBalances = async () => {
    if (!isAuthenticated) return;
    
    try {
      // Fetch EOA balance
      if (eoaAddress) {
        const eoaResponse = await fetch(`https://alfajores-forno.celo-testnet.org`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [eoaAddress, 'latest'],
            id: 1
          })
        });
        const eoaData = await eoaResponse.json();
        if (eoaData.result) {
          const balanceWei = BigInt(eoaData.result);
          const balanceCELO = Number(balanceWei) / 10 ** 18;
          setEoaBalance(balanceCELO.toFixed(4));
        }
      }
      
      // Fetch Smart Account balance
      if (smartAccountAddress) {
        const saResponse = await fetch(`https://alfajores-forno.celo-testnet.org`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [smartAccountAddress, 'latest'],
            id: 1
          })
        });
        const saData = await saResponse.json();
        if (saData.result) {
          const balanceWei = BigInt(saData.result);
          const balanceCELO = Number(balanceWei) / 10 ** 18;
          setSmartAccountBalance(balanceCELO.toFixed(4));
        }
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  // Fetch balances when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBalances();
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, eoaAddress, smartAccountAddress]);

  // Main send function using LLM hook
  async function onSend() {
    if (!input.trim() || isProcessing || llmLoading) return;
    
    const text = input;
    setInput('');
    setIsProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      // Step 1: Process payment
      console.log('Processing payment for message:', text);
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if user is authenticated
      if (!isAuthenticated || !primaryAddress) {
        throw new Error('Please connect your wallet to send messages');
      }

      let paymentData: any = {};

      // Process payment (either mode)
      try {
        const paymentRes = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ 
            messageId,
            userType,
            primaryAddress,
            userId,
            paymentMode
          })
        });

        paymentData = await paymentRes.json();
        
        if (!paymentRes.ok) {
          throw new Error(paymentData.error || 'Payment failed');
        }

        if (!paymentData.ok) {
          throw new Error('Payment processing failed');
        }
      } catch (paymentError: any) {
        console.warn('Payment failed, but continuing with chat:', paymentError);
        // Continue with chat even if payment fails
        paymentData = {
          ok: true,
          paymentMode: 'disabled',
          userOpHash: '0x_no_payment',
          message: 'Payment disabled for testing'
        };
      }

      console.log('Payment processed:', paymentData);
      setPaymentStatus('success');

      // Add transaction record
      const transactionRecord: TransactionRecord = {
        id: messageId,
        messageText: text,
        hash: paymentData.userOpHash || paymentData.transactionHash || '0x_no_hash',
        paymentMode,
        timestamp: new Date(),
        status: 'success'
      };
      setTransactions(prev => [transactionRecord, ...prev]);

      // Step 2: Add user message to LLM session
      addMessage({
        role: 'user',
        content: text
      });

      // Step 3: Get AI response using LLM hook
      try {
        console.log('Getting LLM response...');
        const response = await chatComplete({ 
          model: model,
          messages: [...(currentSession?.messages || []), {
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
          }]
        });
        
        console.log('LLM response received:', response);
        setPaymentStatus('idle');

      } catch (llmError: any) {
        console.error('LLM error:', llmError);
        // Add a fallback assistant message
        addMessage({
          role: 'assistant',
          content: 'I apologize, but I encountered an issue processing your request. The message has been saved to your conversation.'
        });
        setPaymentStatus('idle');
      }

      // Refresh balances after payment
      setTimeout(fetchBalances, 2000);

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

  // Function to copy text to clipboard
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
        {/* Header with LLM and Filecoin Status */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    MotusDAO Chat
                  </h1>
                  <p className="text-sm text-gray-600">AI Chat with Filecoin Storage</p>
                </div>
              </div>
              
              {/* LLM Status */}
              <div className="flex items-center space-x-4">
                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                  <div className="text-xs text-gray-600 mb-1">LLM Model</div>
                  <div className="text-sm font-bold text-gray-900">{model}</div>
                  {llmLoading && <div className="text-xs text-blue-600">Processing...</div>}
                </div>
                
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                  <div className="text-xs text-gray-600 mb-1">Filecoin</div>
                  <div className="text-sm font-bold text-gray-900">
                    {filecoinConnected ? '🟢 Connected' : '🔴 Offline'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lastSyncStatus === 'success' ? 'Synced' : lastSyncStatus || 'Ready'}
                  </div>
                </div>

                {isAuthenticated && (
                  <>
                    <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                      <div className="text-xs text-gray-600 mb-1">EOA Balance</div>
                      <div className="text-sm font-bold text-gray-900">{eoaBalance} CELO</div>
                      <div className="text-xs text-gray-500 truncate max-w-20" title={eoaAddress || ''}>
                        {eoaAddress ? `${eoaAddress.slice(0, 6)}...${eoaAddress.slice(-4)}` : '---'}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                      <div className="text-xs text-gray-600 mb-1">Smart Account</div>
                      <div className="text-sm font-bold text-gray-900">{smartAccountBalance} CELO</div>
                      <div className="text-xs text-gray-500 truncate max-w-20" title={smartAccountAddress || ''}>
                        {smartAccountAddress ? `${smartAccountAddress.slice(0, 6)}...${smartAccountAddress.slice(-4)}` : '---'}
                      </div>
                    </div>
                  </>
                )}

                <div className="text-center p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-200/50">
                  <div className="text-xs text-gray-600 mb-1">Session</div>
                  <div className="text-sm font-bold text-gray-900">
                    {currentSession?.messages.length || 0} msgs
                  </div>
                </div>
              </div>
            </div>

            {/* Role and Model Selection */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex gap-2">
                <span className="text-sm text-gray-600 self-center">Role:</span>
                <button 
                  onClick={() => setRole('user')} 
                  className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                    role === 'user'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  👤 User
                </button>
                <button 
                  onClick={() => setRole('pro')} 
                  className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                    role === 'pro'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  🎯 Professional
                </button>
              </div>

              <div className="flex gap-2">
                <span className="text-sm text-gray-600 self-center">Payment:</span>
                <button
                  onClick={() => setPaymentMode('smart-account')}
                  className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                    paymentMode === 'smart-account'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                  }`}
                >
                  🏦 Smart Account
                </button>
                <button
                  onClick={() => setPaymentMode('user-wallet')}
                  className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                    paymentMode === 'user-wallet'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                  }`}
                >
                  👤 User Wallet
                </button>
              </div>

              <button
                onClick={() => setShowTransferModal(true)}
                disabled={!isAuthenticated}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-200 text-sm transition-all disabled:opacity-50"
              >
                💸 Transfer to Smart Account
              </button>

              <button
                onClick={() => setShowFilecoinPanel(!showFilecoinPanel)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-200 text-sm transition-all"
              >
                🗄️ {showFilecoinPanel ? 'Hide' : 'Show'} Filecoin Panel
              </button>
            </div>

            {/* Error Display */}
            {(error || llmError) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">⚠️</span>
                  <span className="text-red-800 text-sm">{error || llmError}</span>
                </div>
              </div>
            )}

            {/* Payment Status */}
            {paymentStatus === 'processing' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-blue-800 text-sm">Processing payment...</span>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-green-800 text-sm">Payment processed! Getting AI response...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Layout */}
        <div className={`grid gap-6 ${showFilecoinPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Chat Area */}
          <div className={showFilecoinPanel ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
              
              {/* Messages Display */}
              <div className="h-[60vh] overflow-y-auto p-6">
                {!currentSession || currentSession.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Start a Conversation</h3>
                      <p className="text-sm text-gray-600">Your messages will be automatically saved to Filecoin</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentSession.messages.map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`p-4 rounded-2xl ${
                            message.role === 'user' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : 'bg-white/90 border border-gray-200 text-gray-900'
                          }`}>
                            <div className="flex items-start space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                message.role === 'user' ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                              }`}>
                                {message.role === 'user' ? '👤' : '🤖'}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs opacity-80 mb-2">
                                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                                  <span className="ml-2 text-xs opacity-60">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="leading-relaxed text-sm">{message.content}</div>
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
                    placeholder={isProcessing || llmLoading ? "Processing..." : "Type your message here..."}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm"
                    disabled={isProcessing || llmLoading}
                  />
                  <button 
                    onClick={onSend}
                    disabled={isProcessing || llmLoading || !input.trim()}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isProcessing || llmLoading || !input.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isProcessing || llmLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

                {/* Quick Actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={saveCurrentConversation}
                    disabled={!currentSession || currentSession.messages.length === 0}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-200 text-xs transition-all disabled:opacity-50"
                  >
                    💾 Save to Filecoin
                  </button>
                  
                  <select
                    value={model}
                    onChange={(e) => changeModel(e.target.value)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 text-xs"
                  >
                    <option value="llama3.1:8b">Llama 3.1 8B</option>
                    <option value="llama3.1:70b">Llama 3.1 70B</option>
                    <option value="qwen2.5:7b">Qwen 2.5 7B</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Filecoin Panel */}
          {showFilecoinPanel && (
            <div className="lg:col-span-1">
              <FilecoinQueryPanel className="h-full" />
            </div>
          )}
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Transactions</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {tx.messageText.length > 50 ? `${tx.messageText.slice(0, 50)}...` : tx.messageText}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.paymentMode} • {tx.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        tx.status === 'success' ? 'bg-green-100 text-green-700' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.hash)}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        title="Copy transaction hash"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Session Info */}
        {currentSession && (
          <div className="mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Current Session:</span> {currentSession.metadata.topic || 'Untitled'}
                  <span className="ml-4">Messages: {currentSession.messages.length}</span>
                  {currentSession.filecoinCID && (
                    <span className="ml-4 text-green-600">📁 Stored on Filecoin</span>
                  )}
                </div>
                
                {/* Explorer Links */}
                {currentSession.explorerUrls && Object.keys(currentSession.explorerUrls).length > 0 && (
                  <div className="flex gap-2">
                    {currentSession.explorerUrls.cid && (
                      <a 
                        href={currentSession.explorerUrls.cid} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        🔗 View on Filscan
                      </a>
                    )}
                    {currentSession.explorerUrls.ipfs && (
                      <a 
                        href={currentSession.explorerUrls.ipfs} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                      >
                        📁 IPFS Gateway
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <Transfer 
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => {
            setShowTransferModal(false);
            setTimeout(fetchBalances, 2000);
          }}
        />
      )}
    </div>
  );
}

// Main page component with provider
export default function ChatPage() {
  return (
    <LLMWithFilecoinProvider>
      <ChatComponent />
    </LLMWithFilecoinProvider>
  );
}
