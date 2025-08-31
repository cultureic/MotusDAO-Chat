const { createPublicClient, http, parseAbi } = require("viem");

const entryPointAbi = parseAbi([
  "function getNonce(address sender, uint192 key) view returns (uint256)"
]);

async function checkUserWalletNonce() {
  try {
    console.log('🔍 Checking user wallet nonce...');
    
    const client = createPublicClient({ 
      transport: http('https://alfajores-forno.celo-testnet.org') 
    });
    
    const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const userSmartWallet = "0x08f22a34736e010a5d6dDCAa1783BFE0677A2aF6";
    
    console.log('📋 User Smart Wallet:', userSmartWallet);
    console.log('📋 Entry Point:', entryPoint);
    
    const nonce = await client.readContract({
      address: entryPoint,
      abi: entryPointAbi,
      functionName: "getNonce",
      args: [userSmartWallet, 0n],
    });
    
    console.log('✅ Current Nonce:', nonce.toString());
    console.log('✅ Nonce (hex):', `0x${nonce.toString(16)}`);
    
    if (nonce === 0n) {
      console.log('⚠️  Nonce is 0 - account needs deployment or has never been used');
      console.log('💡 This is why you get "AA20 account not deployed" error');
    } else {
      console.log('✅ Account has been used before - nonce > 0');
    }
    
  } catch (error) {
    console.error('❌ Error checking nonce:', error);
  }
}

checkUserWalletNonce();
