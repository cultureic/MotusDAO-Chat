'use client';
import { useState, useEffect } from 'react';
import { useSmartAccount } from '@/lib/smart-account';
import { useWallets, useSendTransaction, useSessionSigners } from '@privy-io/react-auth';

type Role = 'user' | 'pro';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';
type PaymentMode = 'smart-account' | 'user-wallet';

interface Message {
  role: string;
  text: string;
  txHash?: string;
  userOpHash?: string;
  timestamp?: number;
}

export default function ChatPage() {
  const [role, setRole] = useState<Role>('user');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('smart-account');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTxHistory, setShowTxHistory] = useState(true);
  const [eoaBalance, setEoaBalance] = useState<string>('0');
  const [smartAccountBalance, setSmartAccountBalance] = useState<string>('0');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState<string>('0.1');
  const [transferPercentage, setTransferPercentage] = useState<number>(25);
  const [isTransferring, setIsTransferring] = useState(false);
  
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
  
  // Get session signers for smart account authorization
  const sessionSigners = useSessionSigners();

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
      // Refresh balances every 30 seconds
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, eoaAddress, smartAccountAddress]);

  // Transfer funds from EOA to Smart Account
  const handleTransfer = async () => {
    if (!eoaAddress || !smartAccountAddress || isTransferring) return;
    
    setIsTransferring(true);
    try {
      // Calculate transfer amount based on percentage or fixed amount
      let amountToTransfer: string;
      if (transferPercentage > 0) {
        const eoaBalanceNum = parseFloat(eoaBalance);
        const percentageAmount = (eoaBalanceNum * transferPercentage) / 100;
        amountToTransfer = percentageAmount.toFixed(4);
      } else {
        amountToTransfer = transferAmount;
      }

      console.log(`🔄 Transferring ${amountToTransfer} CELO from EOA to Smart Account...`);
      
      // Get the user's EOA wallet
      const eoaWallet = wallets.find(wallet => wallet.address === eoaAddress);
      if (!eoaWallet) {
        throw new Error('EOA wallet not found. Please make sure your wallet is connected.');
      }

      // Convert amount to Wei
      const amountWei = BigInt(Math.floor(parseFloat(amountToTransfer) * 10 ** 18));
      
      // Create transaction
      const transaction = {
        to: smartAccountAddress,
        value: amountWei.toString(),
        data: '0x', // Simple transfer
        chainId: 44787 // Celo Alfajores
      };

      console.log('📝 Transaction details:', transaction);

      // For now, use a simple alert to guide the user
      alert(`To transfer ${amountToTransfer} CELO:\n\n1. Open your wallet (MetaMask)\n2. Send ${amountToTransfer} CELO\n3. From: ${eoaAddress}\n4. To: ${smartAccountAddress}\n5. Network: Celo Alfajores Testnet\n\nAfter transfer, click OK to refresh balances.`);
      
      // Refresh balances after user confirms
      await fetchBalances();
      setShowTransferModal(false);
      setTransferAmount('0.1');
      setTransferPercentage(25);
      
      console.log('✅ Transfer instructions provided to user');

    } catch (error: any) {
      console.error('❌ Transfer error:', error);
      setError(`Transfer failed: ${error.message}`);
    } finally {
      setIsTransferring(false);
    }
  };

  // Update transfer amount when percentage changes
  const handlePercentageChange = (percentage: number) => {
    setTransferPercentage(percentage);
    setTransferAmount('0'); // Clear fixed amount when using percentage
  };

  // Update percentage when amount changes
  const handleAmountChange = (amount: string) => {
    setTransferAmount(amount);
    setTransferPercentage(0); // Clear percentage when using fixed amount
  };

  // Check if session signers are properly configured
  const checkSessionSigners = () => {
    console.log('Session Signers Status:', {
      hasSessionSigners: !!sessionSigners,
      sessionSigners: sessionSigners
    });
    
    return !!sessionSigners;
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
      
      // Check if user is authenticated
      if (!isAuthenticated || !primaryAddress) {
        throw new Error('Please connect your wallet to send messages');
      }

      let paymentData: any = {};

      if (paymentMode === 'user-wallet') {
        // Use Privy's native transaction method for User Wallet Payment
        console.log('Using Privy native transaction for User Wallet Payment');
        
        // Check if session signers are configured
        const hasSessionSigners = checkSessionSigners();
        console.log('Session signers available:', hasSessionSigners);
        
        if (!hasSessionSigners) {
          throw new Error('User Wallet Payment requires session signers, which are not supported on Celo Alfajores. Please use Smart Account Payment mode for automated transactions.');
        }
        
        const chatPayAddress = process.env.NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES;
        const priceWei = process.env.NEXT_PUBLIC_PRICE_PER_MESSAGE_NATIVE_WEI || "2000000000000000";
        
        // Create transaction request
        const transactionRequest = {
          to: chatPayAddress as `0x${string}`,
          value: BigInt(priceWei),
          data: `0x6c16159d0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001b${Buffer.from(messageId).toString('hex').padEnd(64, '0')}` as `0x${string}`,
          chainId: 44787 // Celo Alfajores
        };

        console.log('Sending transaction with Privy:', transactionRequest);
        
        try {
          // Send transaction using Privy's native method
          const txResult = await sendTransaction(transactionRequest);
          
          console.log('Privy transaction result:', txResult);
          
          paymentData = {
            ok: true,
            paymentMode: 'user-wallet',
            userOpHash: txResult.hash || '0x_privy_native',
            txHash: txResult.hash || '0x_privy_native',
            message: 'Payment sent via Privy native transaction'
          };
        } catch (privyError: any) {
          console.error('Privy transaction failed:', privyError);
          
          // Check if it's a session key error
          if (privyError.message?.includes('session keys') || privyError.message?.includes('No valid user session keys')) {
            throw new Error('Smart account not properly initialized. Please try Smart Account Payment mode or reconnect your wallet.');
          }
          
          // For other Privy errors, fall back to Smart Account Payment
          console.log('Falling back to Smart Account Payment due to Privy error');
          
          const fallbackRes = await fetch('/api/pay', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ 
              messageId,
              userType,
              primaryAddress,
              userId,
              paymentMode: 'smart-account' // Force smart account payment
            })
          });

          paymentData = await fallbackRes.json();
          
          if (!fallbackRes.ok) {
            throw new Error(paymentData.error || 'Payment failed');
          }

          if (!paymentData.ok) {
            throw new Error('Payment processing failed');
          }
          
          // Update payment mode to reflect the fallback
          paymentData.paymentMode = 'smart-account-fallback';
          paymentData.message = 'Payment sent via Smart Account (fallback from User Wallet)';
        }
        
      } else {
        // Use existing API for Smart Account Payment
        console.log('Using API for Smart Account Payment');
        
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
              
              {/* Payment Mode Selection */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                <div className="text-sm font-medium text-gray-700 mb-2">Payment Mode:</div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setPaymentMode('smart-account')}
                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-medium text-sm ${
                      paymentMode === 'smart-account'
                        ? 'shadow-lg font-semibold'
                        : 'bg-white/50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-white/80'
                    }`}
                    style={paymentMode === 'smart-account' ? {
                      background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                      color: 'white',
                      borderColor: 'transparent',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    } : {}}
                    disabled={false}
                  >
                    🏦 Smart Account (Gas + CELO)
                  </button>
                  <button
                    onClick={() => setPaymentMode('user-wallet')}
                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-medium text-sm ${
                      paymentMode === 'user-wallet'
                        ? 'shadow-lg font-semibold'
                        : 'bg-white/50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-white/80'
                    }`}
                    style={paymentMode === 'user-wallet' ? {
                      background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                      color: 'white',
                      borderColor: 'transparent',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    } : {}}
                    disabled={false}
                  >
                    👤 User Wallet (Gas Only)
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {paymentMode === 'smart-account' 
                    ? 'Smart account pays for both gas and message cost'
                    : 'User pays CELO separately, gas sponsored by Arka'
                  }
                </div>
              </div>
              
              {/* Balance Display */}
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                <div className="text-sm font-medium text-gray-700 mb-2">Account Balances:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/50 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">EOA Wallet</div>
                    <div className="text-lg font-bold text-gray-900">{eoaBalance}</div>
                    <div className="text-xs text-gray-500">CELO</div>
                    {eoaAddress && (
                      <div className="text-xs text-gray-400 mt-1 font-mono">
                        {eoaAddress.slice(0, 6)}...{eoaAddress.slice(-4)}
                      </div>
                    )}
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Smart Account</div>
                    <div className="text-lg font-bold text-gray-900">{smartAccountBalance}</div>
                    <div className="text-xs text-gray-500">CELO</div>
                    {smartAccountAddress && (
                      <div className="text-xs text-gray-400 mt-1 font-mono">
                        {smartAccountAddress.slice(0, 6)}...{smartAccountAddress.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  💡 Smart Account Mode uses Smart Account balance. User Wallet Mode uses EOA balance.
                </div>
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
                  >
                    💰 Transfer Funds
                  </button>
                </div>
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
                                href={`https://alfajores.celoscan.io/address/0xee175CFCE295ADa16e84f6132f175e40a54117a8`}
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

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Transfer Funds</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Balances */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-xs text-gray-600">EOA Balance</div>
                  <div className="text-lg font-bold text-gray-900">{eoaBalance} CELO</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Smart Account</div>
                  <div className="text-lg font-bold text-gray-900">{smartAccountBalance} CELO</div>
                </div>
              </div>

              {/* Transfer Options */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Amount</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      max={eoaBalance}
                      value={transferAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.1"
                    />
                    <span className="px-3 py-2 text-gray-600">CELO</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Or Transfer Percentage</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((percentage) => (
                      <button
                        key={percentage}
                        onClick={() => handlePercentageChange(percentage)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          transferPercentage === percentage
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {percentage}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {transferPercentage > 0 && (
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-sm text-blue-800">
                      Will transfer: <span className="font-bold">
                        {((parseFloat(eoaBalance) * transferPercentage) / 100).toFixed(4)} CELO
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={isTransferring || (transferPercentage === 0 && parseFloat(transferAmount) <= 0)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTransferring ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Transferring...</span>
                    </div>
                  ) : (
                    'Transfer Funds'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
