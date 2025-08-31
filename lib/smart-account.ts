import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useMemo, useEffect } from 'react';

// Use Privy's smart wallet functionality
export function useSmartAccount() {
  const { user, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  
  // Get the user's smart wallet (if enabled)
  const smartWallet = useMemo(() => {
    // Look for Privy smart wallet or any wallet that's not an EOA
    return wallets.find(wallet => 
      wallet.walletClientType === 'privy' || 
      wallet.walletClientType === 'smart' ||
      wallet.walletClientType === 'embedded'
    );
  }, [wallets]);
  
  // Get the user's EOA wallet (external wallet like MetaMask)
  const eoaWallet = useMemo(() => {
    return wallets.find(wallet => 
      wallet.walletClientType === 'metamask' ||
      wallet.walletClientType === 'walletconnect' ||
      wallet.walletClientType === 'coinbase' ||
      wallet.walletClientType === 'rainbow'
    );
  }, [wallets]);
  
  // Determine user type and primary address
  const userType = useMemo(() => {
    if (smartWallet && !eoaWallet) return 'smart-only'; // Email user with smart account
    if (eoaWallet && !smartWallet) return 'eoa-only'; // EOA user without smart account
    if (eoaWallet && smartWallet) return 'hybrid'; // User with both EOA and smart account
    return 'none';
  }, [smartWallet, eoaWallet]);
  
  // Get the primary address based on user type
  const primaryAddress = useMemo(() => {
    switch (userType) {
      case 'smart-only':
        return smartWallet?.address; // Email user's smart account
      case 'eoa-only':
        return eoaWallet?.address; // EOA user's wallet
      case 'hybrid':
        return smartWallet?.address; // Prefer smart account for transactions
      default:
        return null;
    }
  }, [userType, smartWallet, eoaWallet]);
  
  // For email login, the user might not have an EOA wallet initially
  const eoaAddress = eoaWallet?.address || null; // Don't fallback to user.wallet.address
  const smartAccountAddress = smartWallet?.address;
  
  // Debug logging
  useEffect(() => {
    console.log('SmartAccount Debug - Wallet state:', {
      ready,
      authenticated,
      userType,
      primaryAddress,
      eoaAddress,
      smartAccountAddress,
      walletCount: wallets.length,
      walletTypes: wallets.map(w => ({ 
        address: w.address, 
        type: w.walletClientType,
        chainId: w.chainId 
      })),
      userId: user?.id,
      userEmail: user?.email?.address,
      hasSmartWallet: !!smartWallet,
      hasEOA: !!eoaWallet,
      userWallet: user?.wallet?.address
    });
  }, [ready, authenticated, userType, primaryAddress, eoaAddress, smartAccountAddress, wallets, user, smartWallet, eoaWallet]);
  
  return {
    eoaAddress,
    smartAccountAddress,
    primaryAddress,
    userType,
    isAuthenticated: authenticated,
    userId: user?.id,
    userEmail: user?.email?.address,
    hasSmartWallet: !!smartWallet,
    hasEOA: !!eoaWallet,
    smartWallet,
    eoaWallet,
    isReady: ready,
  };
}

// Get smart account address for a given EOA (for server-side use)
export function getSmartAccountAddress(eoaAddress: string): `0x${string}` {
  if (!eoaAddress) throw new Error('EOA address required');
  
  // For now, return the actual deployed smart account address
  // TODO: Implement proper deterministic smart account generation
  return "0xee175CFCE295ADa16e84f6132f175e40a54117a8" as `0x${string}`;
}
