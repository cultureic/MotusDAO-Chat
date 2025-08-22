const { ethers } = require(hardhat);

async function main() {
  const HNFT = await ethers.getContractFactory(HNFT);
  const hnft = await HNFT.deploy();
  await hnft.deployed();
  console.log(HNFT
