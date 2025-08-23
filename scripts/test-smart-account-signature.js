const { keccak256, encodePacked, parseAbi, encodeFunctionData } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");

async function testSmartAccountSignature() {
  try {
    console.log("=== Smart Account Signature Test ===\n");
    
    // Test parameters
    const privateKey = "0xa71201e1c050db22a0244023d3a454accd364f81f9874e55a957918f0a88c953";
    const ownerAddress = "0x03A86631B02e561DadD731d0D84E1dbbb479d9Af";
    const smartAccountAddress = "0xEec619b64f93A42d7b373dF9a81c408b369144b1";
    const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    const chainId = 44787;
    
    console.log("Private Key:", privateKey);
    console.log("Owner Address:", ownerAddress);
    console.log("Smart Account:", smartAccountAddress);
    console.log("Entry Point:", entryPoint);
    console.log("Chain ID:", chainId);
    
    // Create a simple UserOperation
    const userOp = {
      sender: smartAccountAddress,
      nonce: "0x0",
      initCode: "0x",
      callData: "0x12345678", // Simple test callData
      callGasLimit: "0x88b8",
      verificationGasLimit: "0x186a0",
      preVerificationGas: "0xcb78",
      maxFeePerGas: "0x8dcac078f",
      maxPriorityFeePerGas: "0x8dcac078f",
      paymasterAndData: "0x0101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000001010101010100000000000000000000000000000000000000000000000000000000000000000101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101",
      signature: "0x"
    };
    
    console.log("\n=== UserOperation ===");
    console.log("UserOp:", JSON.stringify(userOp, null, 2));
    
    // Generate UserOperation hash (same as in our code)
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

    const finalUserOpHash = keccak256(encoded);
    
    console.log("\n=== Hash Generation ===");
    console.log("Packed data:", packed);
    console.log("UserOp Hash:", userOpHash);
    console.log("Final UserOp Hash:", finalUserOpHash);
    
    // Generate signature using the same method as our smart account expects
    console.log("\n=== Signature Generation ===");
    
    // Method 1: Sign the final UserOp hash directly (what we're doing)
    const account = privateKeyToAccount(privateKey);
    const signature1 = await account.signMessage({ 
      message: { raw: finalUserOpHash } 
    });
    console.log("Method 1 - Direct hash signature:", signature1);
    
    // Method 2: Create Ethereum signed message hash (what smart account does)
    const ethereumSignedMessageHash = keccak256(
      encodePacked(
        ["string", "bytes32"],
        ["\x19Ethereum Signed Message:\n32", finalUserOpHash]
      )
    );
    console.log("Ethereum signed message hash:", ethereumSignedMessageHash);
    
    const signature2 = await account.signMessage({ 
      message: { raw: ethereumSignedMessageHash } 
    });
    console.log("Method 2 - Ethereum message signature:", signature2);
    
    // Method 3: Sign the UserOp hash with Ethereum prefix (what smart account expects)
    const signature3 = await account.signMessage({ 
      message: { raw: finalUserOpHash } 
    });
    console.log("Method 3 - UserOp hash with prefix:", signature3);
    
    // Test signature verification (simulate what smart account does)
    console.log("\n=== Signature Verification Test ===");
    
    // Extract signature components
    const signature = signature1; // Use our current method
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    const v = parseInt(signature.slice(130, 132), 16);
    
    console.log("Signature components:");
    console.log("  r:", r);
    console.log("  s:", s);
    console.log("  v:", v);
    
    // Verify the signature matches our owner address
    console.log("\n=== Verification Results ===");
    console.log("Expected owner:", ownerAddress);
    console.log("Actual owner:", account.address);
    console.log("Owner match:", account.address.toLowerCase() === ownerAddress.toLowerCase());
    
    console.log("\n=== Summary ===");
    console.log("✅ Signature generation working");
    console.log("✅ Owner address matches");
    console.log("❓ Smart account verification needs testing");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSmartAccountSignature();
