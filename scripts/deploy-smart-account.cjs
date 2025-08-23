const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SimpleSmartAccount to Alfajores...");

  // Get the deterministic smart account address
  const eoaAddress = "0x03A86631B02e561DadD731d0D84E1dbbb479d9Af";
  const eoaLower = eoaAddress.toLowerCase();
  const hash = eoaLower.slice(2); // Remove 0x
  const modifiedHash = hash.slice(0, 20) + hash.slice(20, 40).replace(/[0-9a-f]/g, (c) => {
    return ((parseInt(c, 16) + 1) % 16).toString(16);
  });
  const smartAccountAddress = `0x${modifiedHash}`;

  console.log("EOA Address:", eoaAddress);
  console.log("Smart Account Address:", smartAccountAddress);

  // ERC-4337 EntryPoint address on Alfajores
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

  // Deploy SimpleSmartAccount
  console.log("\nDeploying SimpleSmartAccount...");
  const SimpleSmartAccount = await ethers.getContractFactory("SimpleSmartAccount");
  
  // We need to deploy with CREATE2 to get the exact address
  // For now, let's deploy normally and then verify the address
  const smartAccount = await SimpleSmartAccount.deploy(entryPointAddress, eoaAddress);
  await smartAccount.waitForDeployment();
  
  const deployedAddress = await smartAccount.getAddress();
  console.log("SimpleSmartAccount deployed at:", deployedAddress);

  // Check if the deployed address matches our expected address
  if (deployedAddress.toLowerCase() === smartAccountAddress.toLowerCase()) {
    console.log("✅ Smart account deployed to expected address!");
  } else {
    console.log("⚠️  Smart account deployed to different address:");
    console.log("Expected:", smartAccountAddress);
    console.log("Actual:", deployedAddress);
    console.log("\nYou may need to update your Arka whitelist with the actual address.");
  }

  // Verify the smart account
  console.log("\nVerifying smart account...");
  const owner = await smartAccount.owner();
  const entryPoint = await smartAccount.entryPoint();
  
  console.log("Owner:", owner);
  console.log("EntryPoint:", entryPoint);
  console.log("Nonce:", await smartAccount.nonce());

  console.log("\n=== SMART ACCOUNT DEPLOYMENT SUMMARY ===");
  console.log("Smart Account Address:", deployedAddress);
  console.log("Owner (EOA):", eoaAddress);
  console.log("EntryPoint:", entryPointAddress);
  console.log("\nAdd to Arka whitelist:", deployedAddress);
  console.log("\nAdd to .env.local:");
  console.log(`SMART_ACCOUNT_ADDRESS=${deployedAddress}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
