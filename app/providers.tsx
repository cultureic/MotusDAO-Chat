'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { celo, celoAlfajores } from 'viem/chains';
import { ReactNode, useState } from 'react';

const config = createConfig({
  chains: [celoAlfajores, celo],
  transports: { [celoAlfajores.id]: http(), [celo.id]: http() }
});

export default function AppProviders({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
