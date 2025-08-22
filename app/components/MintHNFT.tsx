'use client';
import { useMemo, useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

const HNFT_ABI = [
  { "type": "function", "name": "mint", "stateMutability": "nonpayable", "inputs": [], "outputs": [{"name":"tokenId","type":"uint256"}] },
  { "type": "function", "name": "hasMinted", "stateMutability": "view", "inputs": [{"name":"","type":"address"}], "outputs": [{"type":"bool"}] },
  { "type": "function", "name": "ownerOf", "stateMutability": "view", "inputs": [{"name":"tokenId","type":"uint256"}], "outputs": [{"type":"address"}] },
  { "type": "function", "name": "setMetadataPointer", "stateMutability": "nonpayable", "inputs": [
      {"name":"tokenId","type":"uint256"},
      {"name":"metadataHash","type":"bytes32"},
      {"name":"uri","type":"string"}
    ], "outputs": [] }
] as const;

export default function MintHNFT() {
  const addressEnv = process.env.NEXT_PUBLIC_HNFT_ADDRESS || '';
  const contractAddress = useMemo(() => (addressEnv && addressEnv.startsWith('0x') ? addressEnv as `0x${string}` : null), [addressEnv]);
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [lastTokenId, setLastTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved transaction hash from localStorage on mount
  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`hnft-tx-${address.toLowerCase()}`);
      if (saved) setTxHash(saved);
      
      const savedTokenId = localStorage.getItem(`hnft-token-${address.toLowerCase()}`);
      if (savedTokenId) setLastTokenId(savedTokenId);
    }
  }, [address]);

  const { data: alreadyMinted } = useReadContract({
    address: contractAddress || undefined,
    abi: HNFT_ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contractAddress && address) }
  });

  async function onMint() {
    if (!contractAddress) { setError('Set NEXT_PUBLIC_HNFT_ADDRESS in .env.local'); return; }
    setError(null);
    try {
      const hash = await writeContract({ address: contractAddress, abi: HNFT_ABI, functionName: 'mint', args: [] });
      setTxHash(hash);
      
      // tokenId is address-as-uint per contract
      if (address) {
        const tokenId = BigInt(address).toString();
        setLastTokenId(tokenId);
        
        // Save to localStorage for persistence
        localStorage.setItem(`hnft-tx-${address.toLowerCase()}`, hash);
        localStorage.setItem(`hnft-token-${address.toLowerCase()}`, tokenId);
      }
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Mint failed');
    }
  }

  return (
    <div className="rounded-2xl border p-4 grid gap-3">
      <div className="font-medium">HNFT</div>
      <div className="text-xs opacity-70">Contract: {contractAddress ?? 'n/a'}</div>
      {!address && <div className="text-amber-300 text-sm">Connect via Privy to mint.</div>}
      {alreadyMinted && <div className="text-emerald-300 text-sm">You have already minted.</div>}
      {error && <div className="text-red-300 text-sm">{error}</div>}
      <div className="flex gap-2">
        <button disabled={!address || !contractAddress || Boolean(alreadyMinted) || isPending}
                onClick={onMint}
                className="px-4 py-2 rounded-xl border disabled:opacity-50">
          {isPending ? 'Minting…' : alreadyMinted ? 'Minted' : 'Mint HNFT'}
        </button>
      </div>
      {txHash && (
        <div className="text-xs opacity-70">
          <div className="break-all">Tx: {txHash}</div>
          <a 
            href={`https://alfajores.celoscan.io/tx/${txHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            View on Celoscan →
          </a>
        </div>
      )}
      {lastTokenId && (
        <div className="text-xs opacity-70">Token ID: {lastTokenId}</div>
      )}
    </div>
  );
}


