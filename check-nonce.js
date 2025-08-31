const { createPublicClient, http, parseAbi } = require("viem");

const entryPointAbi = parseAbi([
  "function getNonce(address sender, uint192 key) view returns (uint256)"
]);

async function checkNonce() {
  try {
    console.log('🔍 Checking smart account nonce...');
    
    const client = createPublicClient({ 
      transport: http('https://alfajores-forno.celo-testnet.org') 
    });
    
    const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const smartAccount = "0xee175CFCE295ADa16e84f6132f175e40a54117a8";
    
    console.log('📋 Smart Account:', smartAccount);
    console.log('📋 Entry Point:', entryPoint);
    
    const nonce = await client.readContract({
      address: entryPoint,
      abi: entryPointAbi,
      functionName: "getNonce",
      args: [smartAccount, 0n],
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

checkNonce();
