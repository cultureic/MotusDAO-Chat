import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      chatPayAddress: process.env.NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES,
      priceWei: process.env.PRICE_PER_MESSAGE_NATIVE_WEI,
      arkaApiKey: process.env.ARKA_API_KEY ? 'SET' : 'MISSING',
      arkaChainId: process.env.ARKA_CHAIN_ID,
      entryPoint: process.env.ENTRYPOINT_ADDRESS_ALFAJORES || 'MISSING',
      rpcUrl: process.env.ALFAJORES_RPC_URL,
      deployerPk: process.env.DEPLOYER_PK ? 'SET' : 'MISSING'
    };

    return Response.json({ 
      status: 'ok', 
      envCheck,
      message: 'Payment system environment check'
    });
  } catch (error: any) {
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
