#!/usr/bin/env node

/**
 * 🧪 Dual Payment System Test
 * Tests both smart account and user wallet payment modes
 */

const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testUser: {
    userType: 'eoa-only',
    primaryAddress: '0x03A86631B02e561DadD731d0D84E1dbbb479d9Af',
    userId: 'test-user-001'
  }
};

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: '🏦 Smart Account Payment Mode',
    paymentMode: 'smart-account',
    expectedBehavior: 'Smart account pays both gas and CELO'
  },
  {
    name: '👤 User Wallet Payment Mode',
    paymentMode: 'user-wallet',
    expectedBehavior: 'Gas sponsored by Arka, user pays CELO separately'
  }
];

async function testPaymentMode(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log(`📋 Expected: ${scenario.expectedBehavior}`);
  
  const messageId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const payload = {
    messageId,
    ...TEST_CONFIG.testUser,
    paymentMode: scenario.paymentMode
  };

  try {
    console.log(`📤 Sending payment request...`);
    console.log(`📋 Message ID: ${messageId}`);
    console.log(`🏦 Payment Mode: ${scenario.paymentMode}`);
    
    const startTime = Date.now();
    
    // Use curl to make the request
    const curlCommand = `curl -s -X POST ${TEST_CONFIG.baseUrl}/api/pay \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(payload)}'`;
    
    const response = execSync(curlCommand, { encoding: 'utf8' });
    const responseTime = Date.now() - startTime;
    
    console.log(`⏱️  Response time: ${responseTime}ms`);
    
    let data;
    try {
      data = JSON.parse(response);
    } catch (parseError) {
      console.log(`❌ Failed to parse response: ${response}`);
      return { success: false, error: 'Invalid JSON response' };
    }
    
    if (data.ok) {
      console.log(`✅ SUCCESS!`);
      console.log(`📋 Payment Mode: ${data.paymentMode}`);
      console.log(`🔗 UserOp Hash: ${data.userOpHash}`);
      console.log(`💰 Amount: ${data.amountWei} wei`);
      console.log(`💬 Message: ${data.message}`);
      
      if (data.note) {
        console.log(`📝 Note: ${data.note}`);
      }
      
      // Verify payment mode specific behavior
      if (scenario.paymentMode === 'smart-account') {
        console.log(`✅ Smart Account Mode: Smart account paid for transaction`);
      } else if (scenario.paymentMode === 'user-wallet') {
        console.log(`✅ User Wallet Mode: Gas sponsored, user pays CELO separately`);
      }
      
      return { success: true, data, responseTime };
    } else {
      console.log(`❌ FAILED!`);
      console.log(`📋 Error: ${data.error || 'Unknown error'}`);
      console.log(`📋 Details:`, data.details || 'No details');
      return { success: false, error: data.error, details: data.details };
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log(`🚀 Starting Dual Payment System Tests`);
  console.log(`📍 Base URL: ${TEST_CONFIG.baseUrl}`);
  console.log(`👤 Test User: ${TEST_CONFIG.testUser.primaryAddress}`);
  
  const results = [];
  
  for (const scenario of TEST_SCENARIOS) {
    const result = await testPaymentMode(scenario);
    results.push({
      scenario: scenario.name,
      ...result
    });
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log(`\n📊 TEST SUMMARY`);
  console.log(`================`);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const time = result.responseTime ? `(${result.responseTime}ms)` : '';
    console.log(`${status} ${index + 1}. ${result.scenario} ${time}`);
    
    if (!result.success) {
      console.log(`   💥 Error: ${result.error}`);
    }
  });
  
  if (successful === results.length) {
    console.log(`\n🎉 ALL TESTS PASSED! Dual payment system is working correctly.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Check the errors above.`);
  }
  
  return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testPaymentMode };
