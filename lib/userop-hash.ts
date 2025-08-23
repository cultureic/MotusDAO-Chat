import { keccak256, encodePacked } from "viem";
import type { Hex } from "viem";

export interface UserOperation {
  sender: Hex;
  nonce: Hex;
  initCode: Hex;
  callData: Hex;
  callGasLimit: Hex;
  verificationGasLimit: Hex;
  preVerificationGas: Hex;
  maxFeePerGas: Hex;
  maxPriorityFeePerGas: Hex;
  paymasterAndData: Hex;
  signature: Hex;
}

/**
 * Generate the UserOperation hash that needs to be signed
 * This follows the ERC-4337 specification
 */
export function getUserOperationHash(
  userOp: UserOperation,
  entryPoint: Hex,
  chainId: number
): Hex {
  const packed = encodePacked(
    [
      "address",
      "uint256", 
      "bytes32",
      "bytes32",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "bytes32",
    ],
    [
      userOp.sender,
      BigInt(userOp.nonce),
      keccak256(userOp.initCode),
      keccak256(userOp.callData),
      BigInt(userOp.callGasLimit),
      BigInt(userOp.verificationGasLimit),
      BigInt(userOp.preVerificationGas),
      BigInt(userOp.maxFeePerGas),
      BigInt(userOp.maxPriorityFeePerGas),
      keccak256(userOp.paymasterAndData),
    ]
  );

  const userOpHash = keccak256(packed);
  
  // Encode the UserOperation hash with the entry point and chain ID
  const encoded = encodePacked(
    ["bytes32", "address", "uint256"],
    [userOpHash, entryPoint, BigInt(chainId)]
  );

  return keccak256(encoded);
}
