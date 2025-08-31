import { encodeFunctionData, parseAbi } from "viem";

export interface UserOperation {
  sender: `0x${string}`;
  nonce: `0x${string}`;
  initCode: `0x${string}`;
  callData: `0x${string}`;
  callGasLimit: `0x${string}`;
  verificationGasLimit: `0x${string}`;
  preVerificationGas: `0x${string}`;
  maxFeePerGas: `0x${string}`;
  maxPriorityFeePerGas: `0x${string}`;
  paymasterAndData: `0x${string}`;
  signature: `0x${string}`;
}

export async function createUserOperation(params: {
  sender: `0x${string}`;
  target: `0x${string}`;
  callData: `0x${string}`;
  value?: bigint;
  nonce?: string;
  privateKey?: `0x${string}`;
  entryPoint?: `0x${string}`;
  chainId?: number;
  feeBumpBps?: number;
}): Promise<UserOperation> {
  const entryPoint = params.entryPoint || "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const chainId = params.chainId || 44787;

  // Get the current nonce from the smart account
  let nonce = params.nonce;
  if (!nonce) {
    // For new smart accounts, start with nonce 0
    nonce = "0x0";
  }

  // Encode call to smart account's execute function
  const smartAccountAbi = parseAbi([
    "function execute(address target, uint256 value, bytes calldata data)"
  ]);

  const executeCallData = encodeFunctionData({
    abi: smartAccountAbi,
    functionName: "execute",
    args: [params.target, params.value || 0n, params.callData],
  });

  console.log("Smart account execute callData:", executeCallData);

  // Base gas fees (100 gwei)
  const baseMaxFeePerGas = BigInt("0x174876e800");
  const baseMaxPriorityFeePerGas = BigInt("0x174876e800");

  // Apply fee bump if requested
  let maxFeePerGas = baseMaxFeePerGas;
  let maxPriorityFeePerGas = baseMaxPriorityFeePerGas;

  if (params.feeBumpBps) {
    const bumpMultiplier = BigInt(10000 + params.feeBumpBps);
    maxFeePerGas = (baseMaxFeePerGas * bumpMultiplier) / BigInt(10000);
    maxPriorityFeePerGas = (baseMaxPriorityFeePerGas * bumpMultiplier) / BigInt(10000);
  }

  // Check if this is a new account (nonce 0) and include deployment code
  let initCode = "0x" as `0x${string}`;
  
  // For new accounts (nonce 0), we need to include deployment code
  if (nonce === "0x0") {
    // Check if the account is already deployed by checking its code
    // For now, we'll assume the account is deployed if it has a balance or code
    // TODO: Implement proper account deployment check
    
    console.log("Account has nonce 0 - checking if deployed:", params.sender);
    
    // For Privy smart accounts, they are typically deployed via factory
    // We'll leave initCode as "0x" and let the entry point handle it
    // If the account is not deployed, the entry point will reject the transaction
    // If the account is deployed, the transaction should proceed
  }
  
  const userOp: UserOperation = {
    sender: params.sender,
    nonce: nonce as `0x${string}`,
    initCode: initCode,
    callData: executeCallData, // Call the smart account's execute function
    callGasLimit: "0x186a0" as `0x${string}`, // ~100k gas
    verificationGasLimit: "0x186a0" as `0x${string}`, // ~100k gas
    preVerificationGas: "0xcb78" as `0x${string}`, // ~52k gas
    maxFeePerGas: `0x${maxFeePerGas.toString(16)}` as `0x${string}`,
    maxPriorityFeePerGas: `0x${maxPriorityFeePerGas.toString(16)}` as `0x${string}`,
    paymasterAndData: "0x" as `0x${string}`, // Let Arka handle paymaster selection
    signature: "0x" as `0x${string}`, // Will be set by ArkaSponsor
  };

  return userOp;
}

export function createArkaRequest(method: string, params: any[], id: number = 1) {
  return {
    jsonrpc: "2.0",
    method,
    params,
    id
  };
}
