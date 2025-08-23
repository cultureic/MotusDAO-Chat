const { ethers } = require("hardhat");

async function main() {
  console.log("Adding deposit to smart account...");

  const smartAccountAddress = "0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB";
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const depositAmount = ethers.parseEther("0.1"); // 0.1 CELO

  console.log("Smart Account:", smartAccountAddress);
  console.log("EntryPoint:", entryPointAddress);
  console.log("Deposit Amount:", ethers.formatEther(depositAmount), "CELO");

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  // Create EntryPoint contract instance with basic interface
  const entryPoint = new ethers.Contract(entryPointAddress, [
    "function getDepositInfo(address account) view returns (uint256 totalDeposit, uint256 staked, uint256 stake, uint256 unstakeDelaySec)",
    "function addDeposit(address account) payable",
    "function depositTo(address account) payable"
  ], signer);

  try {
    // Get the current deposit
    const currentDeposit = await entryPoint.getDepositInfo(smartAccountAddress);
    console.log("Current deposit:", ethers.formatEther(currentDeposit.totalDeposit), "CELO");

    // Add deposit using depositTo method
    console.log("\nAdding deposit...");
    const tx = await entryPoint.depositTo(smartAccountAddress, { value: depositAmount });
    console.log("Transaction sent:", tx.hash);
    
    await tx.wait();
    console.log("✅ Deposit added successfully!");

    // Check the new deposit
    const newDeposit = await entryPoint.getDepositInfo(smartAccountAddress);
    console.log("New deposit:", ethers.formatEther(newDeposit.totalDeposit), "CELO");
    
  } catch (error) {
    console.error("❌ Error adding deposit:", error.message);
    throw error;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
