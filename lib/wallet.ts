// Server-side smart account utilities (no Privy hooks)
export function getSmartAccountAddress(eoaAddress: string): `0x${string}` {
  if (!eoaAddress) throw new Error('EOA address required');
  
  // For now, return the funded smart account address
  // TODO: Implement proper deterministic smart account generation
  return "0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB" as `0x${string}`;
}

export async function authUser() {
  // Dev stub: retorna el usuario autenticado (Privy) y su smart account
  // TODO: Implement proper server-side auth
  return { id: "dev-user" };
}

export async function getUserSmartAccount(userId: string, userType: 'eoa-only' | 'smart-only' | 'hybrid', primaryAddress: string): Promise<`0x${string}`> {
  // Now we receive the actual user information from the client
  if (!primaryAddress) throw new Error('Primary address required');
  
  // For now, use the funded smart account that we know works
  // TODO: Implement proper smart account deployment for new users
  const fundedSmartAccount = "0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB" as `0x${string}`;
  
  console.log('getUserSmartAccount:', {
    userId,
    userType,
    primaryAddress,
    usingFundedAccount: fundedSmartAccount
  });
  
  // Use the funded smart account for all user types until we fix deployment
  return fundedSmartAccount;
}

export async function getUserTokenId(userId: string): Promise<string> {
  // Dev stub: tokenId para DataPointerRegistry (si usas HNFT, mapea aquí)
  return "1";
}
