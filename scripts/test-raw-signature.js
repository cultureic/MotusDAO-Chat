const { keccak256, encodePacked } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");

async function testRawSignature() {
  try {
    console.log("=== Testing Raw Signature ===\n");
    
    const privateKey = "0xa71201e1c050db22a0244023d3a454accd364f81f9874e55a957918f0a88c953";
    const testHash = "0x1234567890123456789012345678901234567890123456789012345678901234";
    
    console.log("Test hash:", testHash);
    
    const account = privateKeyToAccount(privateKey);
    
    // Test 1: signMessage with raw
    console.log("\n--- Test 1: signMessage with raw ---");
    const signature1 = await account.signMessage({ 
      message: { raw: testHash } 
    });
    console.log("Raw signature:", signature1);
    
    // Test 2: signMessage with string
    console.log("\n--- Test 2: signMessage with string ---");
    const signature2 = await account.signMessage({ 
      message: testHash 
    });
    console.log("String signature:", signature2);
    
    // Test 3: Create Ethereum signed message hash manually
    console.log("\n--- Test 3: Manual Ethereum signed message hash ---");
    const ethereumHash = keccak256(
      encodePacked(
        ["string", "bytes32"],
        ["\x19Ethereum Signed Message:\n32", testHash]
      )
    );
    console.log("Manual Ethereum hash:", ethereumHash);
    
    const signature3 = await account.signMessage({ 
      message: { raw: ethereumHash } 
    });
    console.log("Manual Ethereum signature:", signature3);
    
    console.log("\n=== Comparison ===");
    console.log("Raw vs String:", signature1 === signature2 ? "Same" : "Different");
    console.log("Raw vs Manual:", signature1 === signature3 ? "Same" : "Different");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testRawSignature();
