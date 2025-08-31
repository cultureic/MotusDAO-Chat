'use client';
import { useState, useEffect } from 'react';
import { useSmartAccount } from '@/lib/smart-account';
import { useWallets } from '@privy-io/react-auth';

interface TransferProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function Transfer({ onClose, onSuccess }: TransferProps) {
  const [transferAmount, setTransferAmount] = useState<string>('0.1');
  const [transferPercentage, setTransferPercentage] = useState<number>(25);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eoaBalance, setEoaBalance] = useState<string>('0');
  const [smartAccountBalance, setSmartAccountBalance] = useState<string>('0');

  const {
    isAuthenticated,
    eoaAddress,
    smartAccountAddress
  } = useSmartAccount();

  const { wallets } = useWallets();

  // Fetch balances
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

  useEffect(() => {
    fetchBalances();
  }, [isAuthenticated, eoaAddress, smartAccountAddress]);

  // Transfer funds from EOA to Smart Account
  const handleTransfer = async () => {
    if (!eoaAddress || !smartAccountAddress || isTransferring) return;
    
    setIsTransferring(true);
    setError(null);
    
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
      // In a production app, you might want to use a proper wallet connection
      alert(`To transfer ${amountToTransfer} CELO:

1. Open your wallet (MetaMask)
2. Send ${amountToTransfer} CELO
3. From: ${eoaAddress}
4. To: ${smartAccountAddress}
5. Network: Celo Alfajores Testnet

After transfer, the balances will refresh automatically.`);
      
      // Refresh balances after user confirms
      await fetchBalances();
      setTransferAmount('0.1');
      setTransferPercentage(25);
      
      console.log('✅ Transfer instructions provided to user');
      onSuccess();

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Transfer Funds</h3>
          <button
            onClick={onClose}
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

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">⚠️</span>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

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
              onClick={onClose}
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
  );
}
