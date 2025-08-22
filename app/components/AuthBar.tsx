'use client';
import { useMemo } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function AuthBar() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();

  const address = useMemo(() => wallets[0]?.address, [wallets]);

  if (!ready) {
    return (
      <div className="text-xs opacity-70">Loading auth…</div>
    );
  }

  if (!authenticated) {
    return (
      <button onClick={login} className="px-3 py-1 rounded-lg border hover:bg-white/10">Log in</button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="opacity-80">
        {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : (user?.email?.address || 'Signed in')}
      </span>
      <button onClick={logout} className="px-3 py-1 rounded-lg border hover:bg-white/10">Log out</button>
    </div>
  );
}


