# MotusDAO Chat - Native CELO Payment System

## Overview
This system enables charging native CELO per chat message using Account Abstraction (AA) with Etherspot Arka paymaster for gas sponsorship on Celo Alfajores testnet.

## Architecture

### Smart Contracts
- **ChatPayNative**: Accepts native CELO payments and forwards to treasury
- **DataPointerRegistry**: Commits message data on-chain
- **HNFT**: Human NFT for identity management (existing)

### Gas Sponsorship
- **Etherspot Arka**: Verifying Paymaster for gas sponsorship
- **Account Abstraction**: User operations with sponsored gas
- **Native CELO**: Direct CELO payments for message fees

## Environment Setup

### Required Environment Variables (.env.local)
```bash
# Celo Alfajores Configuration
NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES=0x5d6895ac8083063053b501ea8dcc7dbf656965740
NEXT_PUBLIC_DATA_POINTER_REGISTRY_ADDRESS_ALFAJORES=0x7ED2735D17468df545a21720C5b093060D3b5831
PRICE_PER_MESSAGE_NATIVE_WEI=2000000000000000  # 0.002 CELO (server-side)
# Frontend Environment Variables
NEXT_PUBLIC_PRICE_PER_MESSAGE_NATIVE_WEI=2000000000000000

# Arka Configuration (Updated format)
ARKA_API_KEY=etherspot_3Zc8uQUCzzoZjsXAB6cZi3pK
ARKA_CHAIN_ID=44787
# Note: ARKA_URL is no longer needed - we use the direct URL format

# EntryPoint and RPC
ENTRYPOINT_ADDRESS_ALFAJORES=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org

# Smart Account
SMART_ACCOUNT_ADDRESS=0x71AE0f13Ca3519A3a36E53f6113f4B638Cb3acFB

# Treasury (where payments go)
TREASURY_ADDRESS=0x03A86631B02e561DadD731d0D84E1dbbb479d9Af

# Deployer private key (for signing UserOperations)
DEPLOYER_PK=your_private_key_here
```

## Deployment

### 1. Deploy Contracts
```bash
# Deploy ChatPayNative and DataPointerRegistry
pnpm deploy:alfajores-native
```

### 2. Update Environment
After deployment, copy the contract addresses to `.env.local`:
```bash
NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES=0x...
NEXT_PUBLIC_DATAPOINTER_ADDRESS_ALFAJORES=0x...
```

## Etherspot Arka Configuration

### 1. Dashboard Setup
- Go to [Etherspot Arka Dashboard](https://arka.etherspot.io)
- Create project for Alfajores (Chain ID: 44787)
- Note the Verifying Paymaster address: `0x900137b60F0D80814348374CD8E78CFf53d88747`

### 2. Whitelist Configuration

#### Senders Whitelist
Add your smart account addresses:
```
0x1234567890123456789012345678901234567890  # Replace with actual AA addresses
```

#### Targets/Methods Whitelist

**ChatPayNative.payPerMessageNative(string)**
- Gas Cap: 200,000 - 350,000
- Value Cap: ≤ 0.01 CELO
- Method: `payPerMessageNative(string)`

**DataPointerRegistry.commit(uint256,bytes32,string)**
- Gas Cap: 250,000 - 400,000
- Method: `commit(uint256,bytes32,string)`

#### Rate Limits
- Per-minute: 60-120 ops/min
- Daily budget: Set appropriate limit

### 3. Optional: Deposit & Stake
- Deposit v1: ≥ 0.03 CELO
- Stake v1: ≥ 0.02 CELO

## API Endpoints

### POST /api/pay
Pays for a message using native CELO.

**Request:**
```json
{
  "messageId": "msg-001"
}
```

**Response:**
```json
{
  "ok": true,
  "userOpHash": "0x...",
  "txHash": "0x...",
  "amountWei": "2000000000000000"
}
```

### POST /api/commit
Commits message data to DataPointerRegistry.

**Request:**
```json
{
  "messageHash": "0x1234567890...",
  "cid": "ipfs://Qm..."
}
```

**Response:**
```json
{
  "ok": true,
  "userOpHash": "0x...",
  "txHash": "0x..."
}
```

## Client Integration

### Message Flow
1. User sends message
2. Call `/api/pay` with `messageId` → Toast "Paid ✅"
3. Call `/api/commit` with `messageHash` and `cid` → Toast "Committed ✅"
4. Two separate transactions per message for maximum on-chain activity

### Example Client Code
```typescript
// Pay for message
const payResponse = await fetch('/api/pay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messageId: 'msg-001' })
});

// Commit message data
const commitResponse = await fetch('/api/commit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    messageHash: '0x1234...', 
    cid: 'ipfs://Qm...' 
  })
});
```

## Testing

### 1. Direct Contract Test (Optional)
```bash
# Test ChatPayNative directly
cast send $CHATPAY_NATIVE "payPerMessageNative(string)" "msg-1" \
  --value $PRICE_PER_MESSAGE_NATIVE_WEI \
  --rpc-url $ALFAJORES_RPC_URL \
  --private-key $PK_TEST
```

### 2. API Tests
```bash
# Test payment API
curl -X POST http://localhost:3000/api/pay \
  -H "content-type: application/json" \
  -d '{"messageId":"m-001"}'

# Test commit API
curl -X POST http://localhost:3000/api/commit \
  -H "content-type: application/json" \
  -d '{"messageHash":"0x1234567890...","cid":"ipfs://Qm..."}'
```

### 3. Verification
- Check Alfajores Celoscan for sponsored transactions
- Verify treasury received CELO payments
- Confirm DataPointerRegistry events

## Troubleshooting

### Common Issues

1. **"AA sponsor disabled"**
   - Ensure `GAS_SPONSORED_ENABLED=true` in `.env.local`

2. **"Sender not whitelisted"**
   - Add smart account address to Arka sender whitelist

3. **"Target not whitelisted"**
   - Add contract addresses and methods to Arka target whitelist

4. **"Gas cap exceeded"**
   - Increase gas cap in Arka dashboard

5. **"Value cap exceeded"**
   - Increase value cap or reduce `PRICE_PER_MESSAGE_NATIVE_WEI`

### Debug Steps
1. Check environment variables
2. Verify Arka dashboard configuration
3. Confirm contract addresses are correct
4. Check Alfajores RPC connectivity
5. Review transaction logs on Celoscan

## Security Considerations

1. **Access Control**: Implement proper user authentication
2. **Rate Limiting**: Configure appropriate Arka rate limits
3. **Value Caps**: Set reasonable value caps to prevent abuse
4. **Gas Caps**: Monitor and adjust gas caps based on usage
5. **Treasury Security**: Ensure treasury address is secure

## Next Steps

1. **Production Deployment**: Deploy to Celo mainnet
2. **Smart Account Integration**: Implement proper AA wallet resolution
3. **User Authentication**: Integrate with Privy for user management
4. **Monitoring**: Add transaction monitoring and alerts
5. **Analytics**: Track payment metrics and usage patterns
