import { getSponsor } from "@/lib/aa";
import { encodeFunctionData, parseAbi } from "viem";
import { celoAlfajores } from "viem/chains";
import { authUser, getUserSmartAccount } from "@/lib/wallet";
import { entryPointClient, getSaNonce } from "@/lib/entrypoint";

const chatPayNativeAbi = parseAbi([
  "function payPerMessageNative(string messageId) payable"
]);

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
    const messageId = body.messageId;
    
    // Get user information from the client
    const { userType, primaryAddress, userId, userWalletAddress, paymentMode } = body;
    
    if (!userType || !primaryAddress) {
      throw new Error('Missing user information: userType and primaryAddress required');
    }
    
    // Determine payment mode: 'smart-account' (default) or 'user-wallet'
    const mode = paymentMode || process.env.PAYMENT_MODE || 'smart-account';
    console.log('Pay API: Payment mode:', mode);
    
    if (mode === 'user-wallet') {
      console.log('Pay API: Using user wallet payment flow');
      // For user wallet payment, use the connected smart wallet (primaryAddress)
      const userSender = primaryAddress as `0x${string}`;
      console.log('Pay API: User wallet payment using sender:', userSender);
      return await handleUserWalletPayment(body, userSender);
    } else {
      console.log('Pay API: Using smart account payment flow');
      // For smart account payment, use the funded contract
      const fundedSender = await getUserSmartAccount(userId || 'unknown', userType, primaryAddress);
      console.log('Pay API: Smart account payment using sender:', fundedSender);
      return await handleSmartAccountPayment(body, fundedSender);
    }
  } catch (error: any) {
    console.error('Pay API error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack,
      details: {
        messageId: body?.messageId || 'unknown',
        userType: body?.userType || 'unknown',
        primaryAddress: body?.primaryAddress || 'unknown'
      }
    }, { status: 500 });
  }
}

// Smart Account Payment Flow (current working flow)
async function handleSmartAccountPayment(body: any, sender: `0x${string}`) {
  const messageId = body.messageId;
  const chatPay = process.env.NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES as `0x${string}`;
  const priceWei = BigInt(process.env.PRICE_PER_MESSAGE_NATIVE_WEI || "2000000000000000");
  const entryPoint = process.env.ENTRYPOINT_ADDRESS_ALFAJORES as `0x${string}` || "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const rpcUrl = process.env.ALFAJORES_RPC_URL || "https://alfajores-forno.celo-testnet.org";

  console.log('Smart Account Payment: Starting payment for', {
    messageId,
    sender,
    chatPay,
    priceWei: priceWei.toString(),
    entryPoint,
    rpcUrl
  });

  const data = encodeFunctionData({
    abi: chatPayNativeAbi,
    functionName: "payPerMessageNative",
    args: [messageId],
  });

  const sponsor = getSponsor();
  const client = entryPointClient(rpcUrl);
  const nonce = await getSaNonce(client, entryPoint, sender, 0n);

  // Smart account pays the value
  try {
    const r = await sponsor.sponsorAndSend({
      userSmartAccount: sender, target: chatPay, data,
      value: priceWei, // Smart account pays
      chainId: celoAlfajores.id, nonce: nonce.toString()
    });
    
    console.log('Smart Account Payment: Success:', r);
    return Response.json({ 
      ok: true, 
      paymentMode: 'smart-account',
      userOpHash: r.userOpHash,
      txHash: r.txHash || r.userOpHash,
      message: r.message,
      amountWei: priceWei.toString() 
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.error('Smart Account Payment: Failed:', msg);
    
    // Retry with fee bump
    if (msg.includes("cannot be replaced") || msg.toLowerCase().includes("fee too low")) {
      console.log('Smart Account Payment: Retrying with fee bump...');
      const r2 = await sponsor.sponsorAndSend({
        userSmartAccount: sender, target: chatPay, data,
        value: priceWei, // Smart account pays
        chainId: celoAlfajores.id, nonce: nonce.toString(), feeBumpBps: 1500
      });
      
      return Response.json({ 
        ok: true, 
        paymentMode: 'smart-account',
        retried: true, 
        userOpHash: r2.userOpHash,
        txHash: r2.txHash || r2.userOpHash,
        message: r2.message,
        amountWei: priceWei.toString() 
      });
    }
    throw e;
  }
}

// User Wallet Payment Flow (new flow)
async function handleUserWalletPayment(body: any, sender: `0x${string}`) {
  const messageId = body.messageId;
  const chatPay = process.env.NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES as `0x${string}`;
  const priceWei = BigInt(process.env.PRICE_PER_MESSAGE_NATIVE_WEI || "2000000000000000");
  const entryPoint = process.env.ENTRYPOINT_ADDRESS_ALFAJORES as `0x${string}` || "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const rpcUrl = process.env.ALFAJORES_RPC_URL || "https://alfajores-forno.celo-testnet.org";

  console.log('User Wallet Payment: Starting payment for', {
    messageId,
    sender,
    chatPay,
    priceWei: priceWei.toString(),
    entryPoint,
    rpcUrl
  });

  const data = encodeFunctionData({
    abi: chatPayNativeAbi,
    functionName: "payPerMessageNative",
    args: [messageId],
  });

  const sponsor = getSponsor();
  const client = entryPointClient(rpcUrl);
  const nonce = await getSaNonce(client, entryPoint, sender, 0n);

  // Smart account executes but doesn't pay (user should pay separately)
  try {
    const r = await sponsor.sponsorAndSend({
      userSmartAccount: sender, target: chatPay, data,
      value: 0n, // Smart account doesn't pay - user pays separately
      chainId: celoAlfajores.id, nonce: nonce.toString()
    });
    
    console.log('User Wallet Payment: Success (gas only):', r);
    return Response.json({ 
      ok: true, 
      paymentMode: 'user-wallet',
      userOpHash: r.userOpHash,
      txHash: r.txHash || r.userOpHash,
      message: 'Gas sponsored by Arka. User needs to pay CELO separately.',
      amountWei: priceWei.toString(),
      note: 'User wallet payment not yet implemented - only gas is sponsored'
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.error('User Wallet Payment: Failed:', msg);
    
    // Retry with fee bump
    if (msg.includes("cannot be replaced") || msg.toLowerCase().includes("fee too low")) {
      console.log('User Wallet Payment: Retrying with fee bump...');
      const r2 = await sponsor.sponsorAndSend({
        userSmartAccount: sender, target: chatPay, data,
        value: 0n, // Smart account doesn't pay - user pays separately
        chainId: celoAlfajores.id, nonce: nonce.toString(), feeBumpBps: 1500
      });
      
      return Response.json({ 
        ok: true, 
        paymentMode: 'user-wallet',
        retried: true, 
        userOpHash: r2.userOpHash,
        txHash: r2.txHash || r2.userOpHash,
        message: 'Gas sponsored by Arka. User needs to pay CELO separately.',
        amountWei: priceWei.toString(),
        note: 'User wallet payment not yet implemented - only gas is sponsored'
      });
    }
    throw e;
  }
}