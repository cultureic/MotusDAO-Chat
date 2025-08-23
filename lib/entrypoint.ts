import { createPublicClient, http, parseAbi } from "viem";

const entryPointAbi = parseAbi([
  "function getNonce(address sender, uint192 key) view returns (uint256)"
]);

export function entryPointClient(rpcUrl: string) {
  return createPublicClient({ transport: http(rpcUrl) });
}

export async function getSaNonce(client: any, entryPoint: `0x${string}`, sender: `0x${string}`, key: bigint = 0n) {
  return client.readContract({
    address: entryPoint,
    abi: entryPointAbi,
    functionName: "getNonce",
    args: [sender, key],
  }) as Promise<bigint>;
}
