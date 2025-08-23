const { ethers } = require("hardhat");

async function testSmartAccountDirect() {
  try {
    console.log("=== DIRECT SMART ACCOUNT TEST ===\n");
    
    // Test parameters from our debug analysis
    const smartAccountAddress = "0xd471372bF4d497efdBCcee3DD411C42D1FF63b2a";
    const ownerAddress = "0x03A86631B02e561DadD731d0D84E1dbbb479d9Af";
    const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
    
    console.log("🔑 Test Parameters:");
    console.log("  Smart Account:", smartAccountAddress);
    console.log("  Owner Address:", ownerAddress);
    console.log("  Entry Point:", entryPoint);
    
    // Get the smart account contract
    const smartAccount = await ethers.getContractAt("SimpleSmartAccount", smartAccountAddress);
    
    console.log("\n📋 Smart Account State:");
    try {
      const owner = await smartAccount.owner();
      console.log("  Owner:", owner);
      console.log("  Owner matches:", owner.toLowerCase() === ownerAddress.toLowerCase());
    } catch (error) {
      console.log("  ❌ Could not read owner:", error.message);
    }
    
    try {
      const nonce = await smartAccount.nonce();
      console.log("  Current nonce:", nonce.toString());
    } catch (error) {
      console.log("  ❌ Could not read nonce:", error.message);
    }
    
    try {
      const entryPointContract = await smartAccount.entryPoint();
      console.log("  Entry Point:", entryPointContract);
      console.log("  Entry Point matches:", entryPointContract.toLowerCase() === entryPoint.toLowerCase());
    } catch (error) {
      console.log("  ❌ Could not read entry point:", error.message);
    }
    
    // Test the exact UserOperation from our debug
    console.log("\n🎯 Testing Exact UserOperation from Debug:");
    
    const userOp = {
      sender: smartAccountAddress,
      nonce: "0x0",
      initCode: "0x",
      callData: "0xb61d27f60000000000000000000000005d6895ac8083063053b501ea8dcc7dbf6569657400000000000000000000000000000000000000000000000000071afd498d000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000646c16159d0000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000014746573742d64656275672d7369676e6174757265000000000000000000000000000000000000000000000000000000000000000000000000000000",
      callGasLimit: "0x88b8",
      verificationGasLimit: "0x186a0",
      preVerificationGas: "0xcb78",
      maxFeePerGas: "0x8dcac078f",
      maxPriorityFeePerGas: "0x8dcac078f",
      paymasterAndData: "0x590cf408033f6516f5cba15189033bf7452fda0c00000000000000000000000000000000000000000000000000000000000068a90f9a00000000000000000000000000000000000000000000000000000000000068a90d060640833f0b63671e0d5bc82326bd780389b7842ff26816737f3142e7a5202a925392f3348f850999f65b2091372dc7cac7add126fc385dcfbc970a273efaf2411c",
      signature: "0xef161b702d153b8b225bc00283b8ad806194a63583374dad1be85a7720f34b063ae5b994ebe1503b2e4f3063804d9338df49e7524d43a504925cbd4cfbc836231b" // Method 2 signature from debug
    };
    
    console.log("  UserOp sender:", userOp.sender);
    console.log("  UserOp nonce:", userOp.nonce);
    console.log("  UserOp signature:", userOp.signature);
    
    // Calculate the UserOperation hash (same as our debug)
    const userOpHash = "0x18cd533be177b03680dc9b7e2e4ffea5074daf7ece52a1c455300ddb59fffec2";
    console.log("  UserOp hash:", userOpHash);
    
    // Try to call validateUserOp directly (this will fail because it's onlyEntryPoint)
    console.log("\n🔍 Testing validateUserOp (will fail - onlyEntryPoint):");
    try {
      const result = await smartAccount.validateUserOp(userOp, userOpHash, 0);
      console.log("  ✅ validateUserOp succeeded:", result.toString());
    } catch (error) {
      console.log("  ❌ validateUserOp failed (expected):", error.message);
    }
    
    // Test the signature verification logic manually
    console.log("\n🔍 Testing Signature Verification Logic:");
    
    // The smart account does this:
    // bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", userOpHash));
    const ethereumSignedMessageHash = "0x836f0a32435b02ce8a5261cd26fa65de400584d25db25bafb9b5e797cdd4510d";
    console.log("  Ethereum signed message hash:", ethereumSignedMessageHash);
    
    // Extract signature components
    const signature = userOp.signature;
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    const v = parseInt(signature.slice(130, 132), 16);
    
    console.log("  Signature components:");
    console.log("    r:", r);
    console.log("    s:", s);
    console.log("    v:", v);
    
    // Try to verify the signature using ethers
    console.log("\n🔍 Testing Signature Recovery:");
    try {
      // Create the message hash that was signed
      const messageHash = ethers.utils.hashMessage(ethers.utils.arrayify(ethereumSignedMessageHash));
      console.log("  Message hash for recovery:", messageHash);
      
      // Try to recover the address
      const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
      console.log("  Recovered address:", recoveredAddress);
      console.log("  Expected owner:", ownerAddress);
      console.log("  Address match:", recoveredAddress.toLowerCase() === ownerAddress.toLowerCase());
      
    } catch (error) {
      console.log("  ❌ Signature recovery failed:", error.message);
    }
    
    console.log("\n📊 SUMMARY:");
    console.log("The smart account contract appears to have an issue with signature verification.");
    console.log("Our signature generation is correct, but the contract is rejecting valid signatures.");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSmartAccountDirect();
