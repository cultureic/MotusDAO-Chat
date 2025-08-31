const { createPublicClient, http, parseAbi } = require("viem");

const entryPointAbi = parseAbi([
  "function getNonce(address sender, uint192 key) view returns (uint256)"
]);

async function checkFundedNonce() {
  try {
    console.log('🔍 Checking funded smart account nonce...');
    
    const client = createPublicClient({ 
      transport: http('https://alfajores-forno.celo-testnet.org') 
    });
    
    const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const fundedSmartAccount = "0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB";
    
    console.log('📋 Funded Smart Account:', fundedSmartAccount);
    console.log('📋 Entry Point:', entryPoint);
    
    const nonce = await client.readContract({
      address: entryPoint,
      abi: entryPointAbi,
      functionName: "getNonce",
      args: [fundedSmartAccount, 0n],
    });
    
    console.log('✅ Current Nonce:', nonce.toString());
    console.log('✅ Nonce (hex):', `0x${nonce.toString(16)}`);
    
    if (nonce === 0n) {
      console.log('⚠️  Nonce is 0 - account might need deployment or has never been used');
    } else {
      console.log('✅ Account has been used before - nonce > 0');
    }
    
  } catch (error) {
    console.error('❌ Error checking nonce:', error);
  }
}

checkFundedNonce();
