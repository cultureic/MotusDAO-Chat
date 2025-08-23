# 🔧 Arka Policy & Whitelist Configuration Guide

## 📋 **Step 1: Get Smart Account Addresses**

### **For Testing (Current Setup)**
1. Go to `/admin` page in your app
2. Connect your wallet with Privy
3. Copy the **Smart Account** address shown
4. Use this address in Arka whitelist

### **Smart Account Addresses to Whitelist**
```
# Add these to Arka Sender Whitelist:
0x1234567890123456789012345678901234567890  # Test smart account
# Add more as users connect...
```

## 📋 **Step 2: Configure Arka Dashboard**

### **1. Create Project**
- Go to [Etherspot Arka Dashboard](https://arka.etherspot.io)
- Create new project for **Alfajores** (Chain ID: 44787)
- Note the **Verifying Paymaster** address: `0x900137b60F0D80814348374CD8E78CFf53d88747`

### **2. Configure Sender Whitelist**
Add smart account addresses (not EOA addresses):
```
# Example smart account addresses:
0x1234567890123456789012345678901234567890
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
```

### **3. Configure Target Whitelist**
Add contract addresses with gas/value caps:

#### **ChatPayNative Contract**
- **Address**: `0x5D6895Ac8083063053B501EA8dCC7dbF65696574`
- **Method**: `payPerMessageNative(string)`
- **Gas Cap**: 200,000 - 350,000
- **Value Cap**: ≤ 0.01 CELO (10,000,000,000,000,000 wei)

#### **DataPointerRegistry Contract**
- **Address**: `0x08b079e47d0a1d40c0e33595Fe6522ED9c58dCD9`
- **Method**: `commit(uint256,bytes32,string)`
- **Gas Cap**: 250,000 - 400,000
- **Value Cap**: 0 (no value needed)

### **4. Configure Rate Limits**
- **Per-minute**: 60-120 ops/min
- **Daily budget**: Set appropriate limit (e.g., 1000 ops/day)

## 📋 **Step 3: Policy Configuration**

### **Recommended Policy Settings**

#### **Gas Sponsorship Policy**
```json
{
  "policyType": "gasSponsorship",
  "conditions": {
    "senderWhitelist": ["0x1234567890123456789012345678901234567890"],
    "targetWhitelist": [
      {
        "address": "0x5D6895Ac8083063053B501EA8dCC7dbF65696574",
        "methods": ["payPerMessageNative(string)"],
        "gasCap": 350000,
        "valueCap": "10000000000000000000"
      },
      {
        "address": "0x08b079e47d0a1d40c0e33595Fe6522ED9c58dCD9",
        "methods": ["commit(uint256,bytes32,string)"],
        "gasCap": 400000,
        "valueCap": "0"
      }
    ],
    "rateLimits": {
      "perMinute": 120,
      "perDay": 1000
    }
  }
}
```

#### **Value Caps Explanation**
- **ChatPayNative**: Max 0.01 CELO per transaction
- **DataPointerRegistry**: No value needed (gas only)

## 📋 **Step 4: Testing**

### **1. Test Smart Account Generation**
1. Connect wallet at `/admin`
2. Verify smart account address is generated
3. Copy address to Arka whitelist

### **2. Test API Endpoints**
```bash
# Test payment
curl -X POST http://localhost:3000/api/pay \
  -H "content-type: application/json" \
  -d '{"messageId":"test-001"}'

# Test commit
curl -X POST http://localhost:3000/api/commit \
  -H "content-type: application/json" \
  -d '{"messageHash":"0x1234...","cid":"ipfs://Qm..."}'
```

### **3. Verify Transactions**
- Check Alfajores Celoscan for sponsored transactions
- Verify treasury received CELO payments
- Confirm DataPointerRegistry events

## 🔧 **Production Considerations**

### **1. Smart Account Factory**
Replace the simple deterministic address generation with a proper AA framework:
- **Biconomy**: `@biconomy/account`
- **Safe**: `@safe-global/safe-core-sdk`
- **Etherspot**: `@etherspot/prime-sdk`

### **2. User Management**
- Store user EOA → smart account mappings in database
- Implement proper server-side authentication
- Add user registration/login flow

### **3. Security**
- Implement proper access controls
- Add transaction monitoring
- Set up alerts for unusual activity

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"Sender not whitelisted"**
   - Add smart account address (not EOA) to sender whitelist
   - Verify address format is correct

2. **"Target not whitelisted"**
   - Add contract addresses to target whitelist
   - Include correct method signatures

3. **"Gas cap exceeded"**
   - Increase gas cap in Arka dashboard
   - Optimize contract gas usage

4. **"Value cap exceeded"**
   - Increase value cap or reduce transaction value
   - Check `PRICE_PER_MESSAGE_NATIVE_WEI` setting

### **Debug Steps**
1. Check smart account address generation
2. Verify Arka dashboard configuration
3. Test with smaller gas/value limits
4. Check transaction logs on Celoscan
