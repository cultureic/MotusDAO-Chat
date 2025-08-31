# 🔧 Arka Setup Guide - Fix "AA sponsor disabled" Error

## 🚨 Current Issue
Your MotusDAO-Chat is deployed successfully, but the chat functionality is failing with:
```
Error: AA sponsor disabled
```

This happens because the Etherspot Arka paymaster needs to be configured with proper whitelists and policies.

## ✅ Environment Variables Status
All required environment variables are now correctly set in Vercel:

- ✅ `NEXT_PUBLIC_GAS_SPONSORED_ENABLED=true`
- ✅ `GAS_SPONSORED_ENABLED=true` 
- ✅ `ARKA_API_KEY=etherspot_3Zc8uQUCzzoZjsXAB6cZi3pK`
- ✅ `ARKA_CHAIN_ID=44787`
- ✅ `ARKA_URL=https://rpc.etherspot.io`

## 🎯 Required Arka Dashboard Setup

### Step 1: Access Arka Dashboard
1. Go to [Etherspot Arka Dashboard](https://arka.etherspot.io)
2. Login with your account
3. Create/access project for **Alfajores testnet** (Chain ID: 44787)

### Step 2: Configure Whitelist - Sender Addresses
Add the smart account address that the app uses:

**Smart Account Address to Whitelist:**
```
0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB
```

**How to add:**
1. Dashboard → Your Project → Settings → Sender Whitelist
2. Click "Add Address"
3. Enter: `0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB`
4. Save changes

### Step 3: Configure Target Contracts
Add the contract addresses that need gas sponsorship:

#### ChatPayNative Contract
- **Address**: `0x5D6895Ac8083063053B501EA8dCC7dbF65696574`
- **Method**: `payPerMessageNative(string)`
- **Gas Cap**: 350,000
- **Value Cap**: 10,000,000,000,000,000 (0.01 CELO in wei)

#### DataPointerRegistry Contract
- **Address**: `0x08b079e47d0a1d40c0e33595Fe6522ED9c58dCD9`
- **Method**: `commit(uint256,bytes32,string)`
- **Gas Cap**: 400,000
- **Value Cap**: 0

**How to add:**
1. Dashboard → Your Project → Settings → Target Whitelist
2. Add each contract with their respective settings

### Step 4: Set Rate Limits
Configure reasonable limits:
- **Per-minute**: 120 operations
- **Daily budget**: 1000 operations
- **Per-hour**: 500 operations

### Step 5: Verify Configuration
Check that your Arka project shows:
- ✅ Chain ID: 44787 (Celo Alfajores)
- ✅ Sender whitelist: Contains smart account address
- ✅ Target whitelist: Contains both contract addresses
- ✅ API key: Active and valid

## 🔍 Test the Configuration

After completing the Arka setup:

1. **Visit your app**: https://motus-dao-chat.vercel.app/chat
2. **Connect wallet** using Privy
3. **Send a test message**
4. **Check console logs** for detailed error messages

## 🛠 Alternative: Disable AA Sponsorship Temporarily

If you want to test the app without AA sponsorship:

```bash
# Disable gas sponsorship
vercel env rm NEXT_PUBLIC_GAS_SPONSORED_ENABLED production
vercel env rm GAS_SPONSORED_ENABLED production

# Redeploy
vercel --prod
```

This will disable the AA sponsorship and the app should work without the Arka integration (users will pay gas directly).

## 🔄 Re-enable After Arka Setup

Once Arka is properly configured:

```bash
# Re-enable gas sponsorship
echo "true" | vercel env add NEXT_PUBLIC_GAS_SPONSORED_ENABLED production
echo "true" | vercel env add GAS_SPONSORED_ENABLED production

# Redeploy
vercel --prod
```

## 📊 Debug Information

To help debug Arka issues, the app now logs:
- Environment variable status
- Arka URL generation (with hidden API key)
- Smart account addresses being used
- Detailed sponsorship request/response

Check browser console and Vercel function logs for detailed debugging information.

## 🎯 Recommended Next Steps

### Immediate (to fix the error):
1. **Complete Arka dashboard setup** (Steps 1-5 above)
2. **OR temporarily disable AA sponsorship** for testing

### Future improvements:
1. **Dynamic smart account generation** per user
2. **Proper user authentication integration**
3. **Advanced rate limiting and monitoring**
4. **Mainnet deployment with production Arka settings**

---

## Summary

The "AA sponsor disabled" error is now fixed from an environment variable perspective. The remaining issue is likely the Arka dashboard whitelist configuration. Follow the steps above to complete the setup, and your chat functionality should work perfectly with gas-sponsored transactions!

**Current Status**: ✅ Deployed with fixed environment variables
**Next Action**: Configure Arka dashboard whitelists
**Production URL**: https://motus-dao-chat.vercel.app
