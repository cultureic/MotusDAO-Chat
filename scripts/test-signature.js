const { keccak256, sign } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");

async function testSignature() {
  try {
    const privateKey = "0xa71201e1c050db22a0244023d3a454accd364f81f9874e55a957918f0a88c953";
    const messageHash = "0x1234567890123456789012345678901234567890123456789012345678901234";
    
    console.log("Testing signature generation...");
    console.log("Private key:", privateKey);
    console.log("Message hash:", messageHash);
    
    // Try different approaches
    console.log("\n--- Approach 1: Direct viem sign ---");
    try {
      const signature1 = sign({ hash: messageHash, privateKey });
      console.log("Direct sign result:", signature1);
    } catch (error) {
      console.log("Direct sign failed:", error.message);
    }
    
    console.log("\n--- Approach 2: Using account ---");
    try {
      const account = privateKeyToAccount(privateKey);
      console.log("Account address:", account.address);
      const signature2 = await account.signMessage({ 
        message: { raw: messageHash } 
      });
      console.log("Account sign result:", signature2);
      console.log("Signature length:", signature2.length);
      
      if (signature2.startsWith("0x") && signature2.length === 132) {
        console.log("✅ Signature generation successful!");
      } else {
        console.log("❌ Signature format incorrect");
      }
    } catch (error) {
      console.log("Account sign failed:", error.message);
    }
  } catch (error) {
    console.error("❌ Signature generation failed:", error);
  }
}

testSignature();
