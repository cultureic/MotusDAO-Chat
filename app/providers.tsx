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
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // If no Privy app ID is provided, render without Privy provider
  if (!privyAppId || privyAppId.trim() === '' || privyAppId === 'your-privy-app-id-here') {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  }
  
  return (
    <PrivyProvider 
      appId={privyAppId}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#9333ea',
        },
        defaultChain: celoAlfajores,
        supportedChains: [celoAlfajores, celo],
        // Enable embedded wallets for email users
        embeddedWallets: {
          createOnLogin: 'all-users',
        }
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
