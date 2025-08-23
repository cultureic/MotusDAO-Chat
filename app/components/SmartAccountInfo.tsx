'use client';
import { useSmartAccount } from '@/lib/smart-account';

export default function SmartAccountInfo() {
  const { eoaAddress, smartAccountAddress, isAuthenticated } = useSmartAccount();

  if (!isAuthenticated) {
    return (
      <div className="text-sm opacity-70">
        Connect wallet to see smart account
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="opacity-70">EOA: </span>
        <span className="font-mono">
          {eoaAddress ? `${eoaAddress.slice(0, 6)}…${eoaAddress.slice(-4)}` : 'Not connected'}
        </span>
      </div>
      <div>
        <span className="opacity-70">Smart Account: </span>
        <span className="font-mono">
          {smartAccountAddress ? `${smartAccountAddress.slice(0, 6)}…${smartAccountAddress.slice(-4)}` : 'Generating...'}
        </span>
      </div>
      {smartAccountAddress && (
        <div className="text-xs opacity-50">
          Add this to Arka whitelist: {smartAccountAddress}
        </div>
      )}
    </div>
  );
}
