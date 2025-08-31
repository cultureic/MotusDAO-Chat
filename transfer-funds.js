#!/usr/bin/env node

/**
 * 🔄 Transfer CELO from EOA to Smart Account
 * This script helps fund the smart account for testing
 */

const { ethers } = require("hardhat");

async function transferFunds() {
  try {
    console.log("🔄 Transferring CELO from EOA to Smart Account...");
    
    // Account addresses
    const eoaAddress = "0x03A86631B02e561DadD731d0D84E1dbbb479d9Af";
    const smartAccountAddress = "0xee175CFCE295ADa16e84f6132f175e40a54117a8";
    const transferAmount = ethers.parseEther("0.1"); // 0.1 CELO
    
    console.log("📋 From (EOA):", eoaAddress);
    console.log("📋 To (Smart Account):", smartAccountAddress);
    console.log("💰 Amount:", ethers.formatEther(transferAmount), "CELO");
    
    // Get signer (EOA owner)
    const [signer] = await ethers.getSigners();
    console.log("👤 Signer:", signer.address);
    
    // Check EOA balance using RPC call
    const eoaBalanceResponse = await ethers.provider.send("eth_getBalance", [eoaAddress, "latest"]);
    const eoaBalance = BigInt(eoaBalanceResponse);
    console.log("🏦 EOA Balance:", ethers.formatEther(eoaBalance), "CELO");
    
    // Also check the signer's balance
    const signerBalance = await ethers.provider.getBalance(signer.address);
    console.log("🏦 Signer Balance:", ethers.formatEther(signerBalance), "CELO");
    
    if (eoaBalance < transferAmount) {
      console.log("❌ Insufficient balance in EOA");
      return;
    }
    
    // Check Smart Account balance
    const saBalance = await ethers.provider.getBalance(smartAccountAddress);
    console.log("🏦 Smart Account Balance:", ethers.formatEther(saBalance), "CELO");
    
    // Transfer funds
    console.log("\n📤 Sending transaction...");
    const tx = await signer.sendTransaction({
      to: smartAccountAddress,
      value: transferAmount
    });
    
    console.log("📋 Transaction Hash:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    await tx.wait();
    console.log("✅ Transaction confirmed!");
    
    // Check new balances
    const newEoaBalance = await ethers.provider.getBalance(eoaAddress);
    const newSaBalance = await ethers.provider.getBalance(smartAccountAddress);
    
    console.log("\n📊 Updated Balances:");
    console.log("🏦 EOA Balance:", ethers.formatEther(newEoaBalance), "CELO");
    console.log("🏦 Smart Account Balance:", ethers.formatEther(newSaBalance), "CELO");
    
    console.log("\n🎉 Transfer completed successfully!");
    console.log("💡 You can now use Smart Account Mode for payments");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run if called directly
if (require.main === module) {
  transferFunds().catch(console.error);
}

module.exports = { transferFunds };
