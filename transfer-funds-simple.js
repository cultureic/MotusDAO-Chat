#!/usr/bin/env node

/**
 * 🔄 Simple CELO Transfer Script
 * Transfers CELO from EOA to Smart Account using direct RPC calls
 */

const { execSync } = require('child_process');

async function transferFunds() {
  try {
    console.log("🔄 Transferring CELO from EOA to Smart Account...");
    
    // Account addresses
    const eoaAddress = "0x03A86631B02e561DadD731d0D84E1dbbb479d9Af";
    const smartAccountAddress = "0xee175CFCE295ADa16e84f6132f175e40a54117a8";
    const transferAmount = "0x16345785d8a0000"; // 0.1 CELO in hex
    
    console.log("📋 From (EOA):", eoaAddress);
    console.log("📋 To (Smart Account):", smartAccountAddress);
    console.log("💰 Amount: 0.1 CELO");
    
    // Check EOA balance
    console.log("\n📊 Checking EOA balance...");
    const balanceResponse = execSync(`curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["${eoaAddress}", "latest"],"id":1}' https://alfajores-forno.celo-testnet.org`, { encoding: 'utf8' });
    const balanceData = JSON.parse(balanceResponse);
    
    if (balanceData.result) {
      const balanceWei = BigInt(balanceData.result);
      const balanceCELO = Number(balanceWei) / 10 ** 18;
      console.log("🏦 EOA Balance:", balanceCELO.toFixed(4), "CELO");
      
      if (balanceWei < BigInt(transferAmount)) {
        console.log("❌ Insufficient balance in EOA");
        return;
      }
    } else {
      console.log("❌ Failed to get EOA balance");
      return;
    }
    
    // Check Smart Account balance
    console.log("\n📊 Checking Smart Account balance...");
    const saBalanceResponse = execSync(`curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["${smartAccountAddress}", "latest"],"id":1}' https://alfajores-forno.celo-testnet.org`, { encoding: 'utf8' });
    const saBalanceData = JSON.parse(saBalanceResponse);
    
    if (saBalanceData.result) {
      const saBalanceWei = BigInt(saBalanceData.result);
      const saBalanceCELO = Number(saBalanceWei) / 10 ** 18;
      console.log("🏦 Smart Account Balance:", saBalanceCELO.toFixed(4), "CELO");
    }
    
    console.log("\n💡 To transfer funds, you need to:");
    console.log("1. Use MetaMask or another wallet to send 0.1 CELO");
    console.log("2. From:", eoaAddress);
    console.log("3. To:", smartAccountAddress);
    console.log("4. Network: Celo Alfajores Testnet");
    
    console.log("\n🔗 Or use the Celo Faucet to get more test CELO:");
    console.log("https://faucet.celo.org/alfajores");
    
    console.log("\n📋 After transfer, you can test the payment system!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run if called directly
if (require.main === module) {
  transferFunds().catch(console.error);
}

module.exports = { transferFunds };
