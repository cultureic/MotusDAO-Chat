const { ethers } = require("hardhat");

async function main() {
  const HNFT = await ethers.getContractFactory("HNFT");
  const hnft = await HNFT.deploy();
  await hnft.waitForDeployment();
  const address = await hnft.getAddress();
  console.log("HNFT deployed at", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
