import { NextRequest } from 'next/server';
import { getSponsor } from "@/lib/aa";
import { encodeFunctionData, parseAbi } from "viem";
import { celoAlfajores } from "viem/chains";
import { authUser, getUserSmartAccount } from "@/lib/wallet";
import { entryPointClient, getSaNonce } from "@/lib/entrypoint";

const chatPayNativeAbi = parseAbi([
  "function payPerMessageNative(string messageId) payable"
]);

export async function GET(req: NextRequest) {
  try {
    const user = await authUser();
    const sender = await getUserSmartAccount(user.id);
    const chatPay = process.env.NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES as `0x${string}`;
    const priceWei = BigInt(process.env.PRICE_PER_MESSAGE_NATIVE_WEI || "2000000000000000");
    const entryPoint = process.env.ENTRYPOINT_ADDRESS_ALFAJORES as `0x${string}` || "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const rpcUrl = process.env.ALFAJORES_RPC_URL || "https://alfajores-forno.celo-testnet.org";

    console.log('Debug: Starting payment debug...');

    const data = encodeFunctionData({
      abi: chatPayNativeAbi,
      functionName: "payPerMessageNative",
      args: ["debug-test"],
    });

    const sponsor = getSponsor();
    const client = entryPointClient(rpcUrl);
    
    console.log('Debug: Getting nonce...');
    const nonce = await getSaNonce(client, entryPoint, sender, 0n);
    console.log('Debug: Nonce from EntryPoint:', nonce.toString());

    console.log('Debug: Creating UserOperation...');
    const privateKey = process.env.DEPLOYER_PK as `0x${string}`;
    console.log('Debug: Private key available:', !!privateKey);
    
    const userOp = await sponsor.sponsorAndSend({
      userSmartAccount: sender,
      target: chatPay,
      data,
      value: priceWei,
      chainId: celoAlfajores.id,
      nonce: nonce.toString(),
      privateKey
    });

    // Convert userOp to a serializable format
    const serializableUserOp = {
      userOpHash: userOp.userOpHash,
      txHash: userOp.txHash,
      message: userOp.message,
      error: userOp.error
    };

    return Response.json({ 
      success: true, 
      debug: {
        sender,
        chatPay,
        priceWei: priceWei.toString(),
        entryPoint,
        rpcUrl,
        nonce: nonce.toString(),
        userOp: serializableUserOp
      }
    });
  } catch (error: any) {
    console.error('Debug: Error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5)
    }, { status: 500 });
  }
}
