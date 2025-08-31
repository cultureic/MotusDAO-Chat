'use client';
import { useState } from 'react';
import { useSmartAccount } from '@/lib/smart-account';
import { usePrivy } from '@privy-io/react-auth';

export default function SmartAccountInfo() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { eoaAddress, smartAccountAddress, hasSmartWallet, hasEOA, userEmail, isReady, userType, primaryAddress } = useSmartAccount();
  const { authenticated } = usePrivy();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`Copied ${label} to clipboard:`, text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (!authenticated) {
    return (
      <div className="text-sm opacity-70">
        Connect wallet to see smart account details
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* User Email */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm opacity-70">User:</span>
          <span className="text-sm font-medium">
            {userEmail ? `${userEmail.slice(0, 15)}...` : 'Email User'}
          </span>
          {userEmail && <span className="text-green-500 text-xs">✓</span>}
        </div>
      </div>

      {/* EOA Address */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm opacity-70">EOA:</span>
          {eoaAddress ? (
            <button
              onClick={() => copyToClipboard(eoaAddress, 'EOA Address')}
              className={`text-sm font-mono transition-colors cursor-pointer ${
                copiedAddress === eoaAddress 
                  ? 'text-green-600' 
                  : 'text-gray-900 hover:text-purple-600'
              }`}
              title="Click to copy EOA address"
            >
              {`${eoaAddress.slice(0, 8)}…${eoaAddress.slice(-6)}`}
              {copiedAddress === eoaAddress && <span className="ml-1">✓</span>}
            </button>
          ) : (
            <span className="text-sm font-mono text-gray-500">Not connected</span>
          )}
          {hasEOA && <span className="text-green-500 text-xs">✓</span>}
        </div>
      </div>

      {/* Smart Wallet Address */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm opacity-70">Smart Wallet:</span>
          {smartAccountAddress ? (
            <button
              onClick={() => copyToClipboard(smartAccountAddress, 'Smart Wallet Address')}
              className={`text-sm font-mono transition-colors cursor-pointer ${
                copiedAddress === smartAccountAddress 
                  ? 'text-green-600' 
                  : 'text-gray-900 hover:text-purple-600'
              }`}
              title="Click to copy Smart Wallet address"
            >
              {`${smartAccountAddress.slice(0, 8)}…${smartAccountAddress.slice(-6)}`}
              {copiedAddress === smartAccountAddress && <span className="ml-1">✓</span>}
            </button>
          ) : (
            <span className="text-sm font-mono text-gray-500">Creating...</span>
          )}
          {hasSmartWallet && <span className="text-green-500 text-xs">✓</span>}
          {!hasSmartWallet && authenticated && <span className="text-yellow-500 text-xs">⏳</span>}
        </div>
      </div>

             {/* User Type */}
       <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
         <div className="flex items-center justify-between">
           <span>Type:</span>
           <span className="font-medium">
             {userType === 'smart-only' ? 'Email User' : 
              userType === 'eoa-only' ? 'EOA User' : 
              userType === 'hybrid' ? 'Hybrid User' : 'Unknown'}
           </span>
         </div>
         <div className="flex items-center justify-between">
           <span>Status:</span>
           <span className="font-medium">
             {hasSmartWallet ? 'Smart Wallet Ready' : authenticated ? 'Creating Smart Wallet...' : 'Connecting...'}
           </span>
         </div>
       </div>

      {/* Arka Whitelist Info */}
      {smartAccountAddress && (
        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg">
          <div className="font-medium mb-1">Arka Whitelist:</div>
          <div className="font-mono text-xs break-all">{smartAccountAddress}</div>
        </div>
      )}
    </div>
  );
}
