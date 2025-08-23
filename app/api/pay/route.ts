import { getSponsor } from "@/lib/aa";
import { encodeFunctionData, parseAbi } from "viem";
import { celoAlfajores } from "viem/chains";
import { authUser, getUserSmartAccount } from "@/lib/wallet";
import { entryPointClient, getSaNonce } from "@/lib/entrypoint";

const chatPayNativeAbi = parseAbi([
  "function payPerMessageNative(string messageId) payable"
]);

export async function POST(req: Request) {
  try {
    const { messageId } = await req.json();
    const user = await authUser();
    const sender = await getUserSmartAccount(user.id);
    const chatPay = process.env.NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES as `0x${string}`;
    const priceWei = BigInt(process.env.PRICE_PER_MESSAGE_NATIVE_WEI || "2000000000000000");
    const entryPoint = process.env.ENTRYPOINT_ADDRESS_ALFAJORES as `0x${string}` || "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const rpcUrl = process.env.ALFAJORES_RPC_URL || "https://alfajores-forno.celo-testnet.org";

    console.log('Pay API: Starting payment for', {
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
    console.log('Pay API: Got sponsor:', typeof sponsor);
    
    const client = entryPointClient(rpcUrl);
    console.log('Pay API: Created client for RPC:', rpcUrl);
    
    const nonce = await getSaNonce(client, entryPoint, sender, 0n);
    console.log('Pay API: Got nonce from EntryPoint:', nonce.toString());

    // First try with current nonce (Arka estimates fees)
    try {
      const r = await sponsor.sponsorAndSend({
        userSmartAccount: sender, target: chatPay, data,
        value: priceWei, chainId: celoAlfajores.id, nonce: nonce.toString()
      });
      console.log('Pay API: First attempt successful:', r);
      return Response.json({ 
        ok: true, 
        userOpHash: r.userOpHash,
        txHash: r.txHash,
        message: r.message,
        amountWei: priceWei.toString() 
      });
    } catch (e: any) {
      const msg = String(e?.message || e);
      console.error('Pay API: First attempt failed:', msg);
      // Replacement rule hit → bump fees and retry once with same nonce
      if (msg.includes("cannot be replaced") || msg.toLowerCase().includes("fee too low")) {
        console.log('Pay API: Retrying with fee bump...');
        const r2 = await sponsor.sponsorAndSend({
          userSmartAccount: sender, target: chatPay, data,
          value: priceWei, chainId: celoAlfajores.id, nonce: nonce.toString(), feeBumpBps: 1500 // +15%
        });
        console.log('Pay API: Retry successful:', r2);
        return Response.json({ 
          ok: true, 
          retried: true, 
          userOpHash: r2.userOpHash,
          txHash: r2.txHash,
          message: r2.message,
          amountWei: priceWei.toString() 
        });
      }
      throw e;
    }
  } catch (error: any) {
    console.error('Pay API error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack,
      details: {
        messageId,
        sender,
        chatPay,
        entryPoint,
        rpcUrl: rpcUrl
      }
    }, { status: 500 });
  }
}