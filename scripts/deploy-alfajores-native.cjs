const { ethers } = require("hardhat");

async function main() {
  const treasury = process.env.TREASURY_ADDRESS || "0xf229F3Dcea3D7cd3cA5ca41C4C50135D7b37F2b9";
  
  console.log("Deploying contracts to Alfajores...");
  console.log("Treasury address:", treasury);

  // 1) Deploy ChatPayNative
  console.log("\n1. Deploying ChatPayNative...");
  const ChatPayNative = await ethers.getContractFactory("ChatPayNative");
  const chatPayNative = await ChatPayNative.deploy(treasury);
  await chatPayNative.waitForDeployment();
  const chatPayAddress = await chatPayNative.getAddress();
  console.log("ChatPayNative deployed at:", chatPayAddress);

  // 2) Deploy DataPointerRegistry
  console.log("\n2. Deploying DataPointerRegistry...");
  const DataPointerRegistry = await ethers.getContractFactory("DataPointerRegistry");
  const dataPointerRegistry = await DataPointerRegistry.deploy();
  await dataPointerRegistry.waitForDeployment();
  const dataPointerAddress = await dataPointerRegistry.getAddress();
  console.log("DataPointerRegistry deployed at:", dataPointerAddress);

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("ChatPayNative:", chatPayAddress);
  console.log("DataPointerRegistry:", dataPointerAddress);
  console.log("\nAdd to .env.local:");
  console.log(`NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES=${chatPayAddress}`);
  console.log(`NEXT_PUBLIC_DATAPOINTER_ADDRESS_ALFAJORES=${dataPointerAddress}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
