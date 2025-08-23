import { getSponsor } from "@/lib/aa";
import { encodeFunctionData, parseAbi } from "viem";
import { celoAlfajores } from "viem/chains";
import { authUser, getUserSmartAccount, getUserTokenId } from "@/lib/wallet";

const dpAbi = parseAbi([
  "function commit(uint256 tokenId, bytes32 messageHash, string cid)"
]);

export async function POST(req: Request) {
  try {
    const { messageHash, cid } = await req.json();
    const user = await authUser();
    const sender = await getUserSmartAccount(user.id);
    const tokenId = BigInt(await getUserTokenId(user.id));

    const registry = process.env.NEXT_PUBLIC_DATAPOINTER_ADDRESS_ALFAJORES as `0x${string}`;
    const data = encodeFunctionData({
      abi: dpAbi,
      functionName: "commit",
      args: [tokenId, messageHash as `0x${string}`, cid],
    });

    const sponsor = getSponsor();
    const privateKey = process.env.DEPLOYER_PK as `0x${string}`;
    
    const r = await sponsor.sponsorAndSend({
      userSmartAccount: sender,
      target: registry,
      data,
      chainId: celoAlfajores.id,
      privateKey,                      // Private key for signing UserOperations
    });

    return Response.json({ ok: true, ...r });
  } catch (error: any) {
    console.error('Commit API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
