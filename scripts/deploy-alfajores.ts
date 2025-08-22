import { ethers } from 'hardhat';

async function main() {
  const hnft = await ethers.deployContract('HNFT');
  await hnft.waitForDeployment();
  const address = await hnft.getAddress();
  console.log('HNFT deployed at', address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


