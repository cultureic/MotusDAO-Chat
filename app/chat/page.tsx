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
  const [showTxHistory, setShowTxHistory] = useState(false);

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

  // Function to check transaction status
  const checkTransactionStatus = async (userOpHash: string) => {
    try {
      // You can add a status check API here if needed
      // For now, we'll just show the transaction hash
      console.log('Checking transaction status for:', userOpHash);
      return 'pending'; // or 'confirmed', 'failed'
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return 'unknown';
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
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setRole('user')} 
            className={`px-3 py-1 rounded-lg border ${role==='user'?'bg-white/10':''}`}
            disabled={isProcessing}
          >
            User
          </button>
          <button 
            onClick={() => setRole('pro')} 
            className={`px-3 py-1 rounded-lg border ${role==='pro'?'bg-white/10':''}`}
            disabled={isProcessing}
          >
            Professional
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-70 text-sm">Cost: {getPaymentAmount()} CELO per message</span>
          <span className="opacity-70 text-sm">This is not clinical advice.</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs opacity-70">Smart Account Connected</span>
          </div>
          <button
            onClick={() => setShowTxHistory(!showTxHistory)}
            className="px-2 py-1 text-xs rounded border opacity-70 hover:opacity-100"
          >
            {showTxHistory ? 'Hide' : 'Show'} Tx History
          </button>
        </div>
      </div>

      <div className="h-[60vh] overflow-y-auto rounded-2xl border p-4 backdrop-blur bg-white/5">
        {error && (
          <div className="mb-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300">
            {error}
          </div>
        )}
        
        {paymentStatus === 'processing' && (
          <div className="mb-3 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300">
            Processing payment... Please wait.
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div className="mb-3 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300">
            Payment successful! Getting AI response...
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className="py-1">
            <span className="opacity-70 mr-2">{m.role}:</span>
            <span>{m.text}</span>
            {m.userOpHash && m.userOpHash !== '0x_no_userop_hash' && (
              <div className="mt-1 text-xs opacity-60">
                <span className="mr-2">UserOp: {m.userOpHash.slice(0, 10)}...{m.userOpHash.slice(-8)}</span>
                <button
                  onClick={() => copyToClipboard(m.userOpHash!)}
                  className="text-gray-400 hover:text-gray-300 mr-2"
                  title="Copy UserOp Hash"
                >
                  📋
                </button>
                <a 
                  href={`https://alfajores.celoscan.io/tx/${m.userOpHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  View on Explorer
                </a>
              </div>
            )}
            {m.txHash && m.txHash !== '0x_no_tx_hash' && (
              <div className="mt-1 text-xs opacity-60">
                <span className="mr-2">Tx: {m.txHash.slice(0, 10)}...{m.txHash.slice(-8)}</span>
                <button
                  onClick={() => copyToClipboard(m.txHash!)}
                  className="text-gray-400 hover:text-gray-300 mr-2"
                  title="Copy Transaction Hash"
                >
                  📋
                </button>
                <a 
                  href={`https://alfajores.celoscan.io/tx/${m.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  View Transaction
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {showTxHistory && (
        <div className="rounded-2xl border p-4 backdrop-blur bg-white/5">
          <h3 className="text-sm font-medium mb-3">Transaction History</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {messages
              .filter(m => m.userOpHash && m.userOpHash !== '0x_no_userop_hash')
              .map((m, i) => (
                <div key={i} className="text-xs p-2 rounded bg-black/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="opacity-70">{m.role}: {m.text.slice(0, 30)}...</div>
                      <div className="mt-1">
                        <span className="opacity-60">UserOp: </span>
                        <span className="font-mono">{m.userOpHash?.slice(0, 16)}...</span>
                      </div>
                      {m.txHash && m.txHash !== '0x_no_tx_hash' && (
                        <div className="mt-1">
                          <span className="opacity-60">Tx: </span>
                          <span className="font-mono">{m.txHash?.slice(0, 16)}...</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <a 
                        href={`https://alfajores.celoscan.io/tx/${m.userOpHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs underline"
                      >
                        Explorer
                      </a>
                      {m.txHash && m.txHash !== '0x_no_tx_hash' && (
                        <a 
                          href={`https://alfajores.celoscan.io/tx/${m.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-xs underline"
                        >
                          Tx
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {messages.filter(m => m.userOpHash && m.userOpHash !== '0x_no_userop_hash').length === 0 && (
              <div className="text-xs opacity-60 text-center py-4">
                No transactions yet. Send a message to see transaction history.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isProcessing ? "Processing..." : "Type a message"}
          className="flex-1 px-3 py-2 rounded-xl border bg-black/20"
          disabled={isProcessing}
        />
        <button 
          onClick={onSend} 
          disabled={isProcessing || !input.trim()}
          className={`px-4 py-2 rounded-xl border ${
            isProcessing || !input.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-white/10'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
