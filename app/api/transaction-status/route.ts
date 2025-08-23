import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userOpHash = searchParams.get('userOpHash');
  const txHash = searchParams.get('txHash');

  if (!userOpHash && !txHash) {
    return Response.json({ error: 'Missing userOpHash or txHash parameter' }, { status: 400 });
  }

  try {
    // For now, return basic transaction info
    // In a real implementation, you'd query the blockchain or a service like Etherscan
    const transactionInfo = {
      userOpHash,
      txHash,
      status: 'pending', // or 'confirmed', 'failed'
      timestamp: Date.now(),
      network: 'Celo Alfajores',
      explorerUrl: userOpHash 
        ? `https://alfajores.celoscan.io/tx/${userOpHash}`
        : `https://alfajores.celoscan.io/tx/${txHash}`
    };

    return Response.json({ success: true, transaction: transactionInfo });
  } catch (error: any) {
    console.error('Error checking transaction status:', error);
    return Response.json({ 
      error: 'Failed to check transaction status',
      details: error.message 
    }, { status: 500 });
  }
}
