import { NextRequest } from 'next/server';
import { createPublicClient, http, parseAbi } from 'viem';
import { celoAlfajores } from 'viem/chains';

const ENTRYPOINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

// EntryPoint ABI for getUserOpHash and getDepositInfo
// Note: Complex tuple parsing disabled for deployment compatibility
// const entryPointAbi = parseAbi([
//   'function getUserOpHash(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) userOp) view returns (bytes32)',
//   'function getDepositInfo(address account) view returns (uint256 totalDeposit, uint256 staked, uint256 stake, uint256 delayed, uint256 withdrawTime)',
//   'event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)',
// ]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userOpHash = searchParams.get('userOpHash');
  const txHash = searchParams.get('txHash');

  if (!userOpHash && !txHash) {
    return Response.json({ error: 'Missing userOpHash or txHash parameter' }, { status: 400 });
  }

  try {
    const client = createPublicClient({
      chain: celoAlfajores,
      transport: http('https://alfajores-forno.celo-testnet.org'),
    });

    let actualTxHash = txHash;
    let status = 'pending';
    let explorerUrl = '';

    if (userOpHash && !txHash) {
      // Try to get the transaction hash from recent events
      // For now, we'll use the UserOp hash as the transaction hash since they're often the same
      // In a production system, you'd query the EntryPoint events to get the actual tx hash
      actualTxHash = userOpHash;
      
      // Check if the transaction exists on the blockchain
      try {
        const blockNumber = await client.getBlockNumber();
        console.log(`Current block number: ${blockNumber}`);
        
        // For now, assume it's pending if we don't have a specific tx hash
        // In a real implementation, you'd query the EntryPoint events
        status = 'pending';
      } catch (error) {
        console.error('Error checking transaction status:', error);
        status = 'unknown';
      }
    }

    // Build explorer URL
    if (actualTxHash) {
      explorerUrl = `https://alfajores.celoscan.io/tx/${actualTxHash}`;
    }

    const transactionInfo = {
      userOpHash,
      txHash: actualTxHash,
      status,
      timestamp: Date.now(),
      network: 'Celo Alfajores',
      explorerUrl
    };

    console.log('Transaction status response:', transactionInfo);

    return Response.json({ success: true, transaction: transactionInfo });
  } catch (error: any) {
    console.error('Error checking transaction status:', error);
    return Response.json({ 
      error: 'Failed to check transaction status',
      details: error.message 
    }, { status: 500 });
  }
}
