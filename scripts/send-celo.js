const { ethers } = require("hardhat");

async function main() {
  console.log("Sending CELO to smart account...");

  const smartAccountAddress = "0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB";
  const amount = ethers.parseEther("0.1"); // 0.1 CELO

  console.log("Smart Account:", smartAccountAddress);
  console.log("Amount:", ethers.formatEther(amount), "CELO");

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  try {
    // Send CELO directly to the smart account
    console.log("\nSending CELO...");
    const tx = await signer.sendTransaction({
      to: smartAccountAddress,
      value: amount
    });
    console.log("Transaction sent:", tx.hash);

    await tx.wait();
    console.log("✅ CELO sent successfully!");

    // Check the new balance
    const balance = await ethers.provider.getBalance(smartAccountAddress);
    console.log("New smart account balance:", ethers.formatEther(balance), "CELO");

  } catch (error) {
    console.error("❌ Error sending CELO:", error.message);
    throw error;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
