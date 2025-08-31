#!/bin/bash

echo "Setting up Vercel environment variables for Account Abstraction..."

# AA Sponsorship Control
echo "true" | vercel env add GAS_SPONSORED_ENABLED production
echo "true" | vercel env add NEXT_PUBLIC_GAS_SPONSORED_ENABLED production

# Arka Configuration
echo "etherspot_3Zc8uQUCzzoZjsXAB6cZi3pK" | vercel env add ARKA_API_KEY production
echo "etherspot_3Zc8uQUCzzoZjsXAB6cZi3pK" | vercel env add NEXT_PUBLIC_ARKA_API_KEY production

echo "44787" | vercel env add ARKA_CHAIN_ID production
echo "44787" | vercel env add NEXT_PUBLIC_ARKA_CHAIN_ID production

echo "https://rpc.etherspot.io" | vercel env add ARKA_URL production
echo "https://rpc.etherspot.io" | vercel env add NEXT_PUBLIC_ARKA_URL production

# Native CELO Payment System
echo "0x5D6895Ac8083063053B501EA8dCC7dbF65696574" | vercel env add NEXT_PUBLIC_CHATPAY_NATIVE_ADDRESS_ALFAJORES production
echo "0x08b079e47d0a1d40c0e33595Fe6522ED9c58dCD9" | vercel env add NEXT_PUBLIC_DATAPOINTER_ADDRESS_ALFAJORES production
echo "2000000000000000" | vercel env add NEXT_PUBLIC_PRICE_PER_MESSAGE_NATIVE_WEI production

# RPC Configuration
echo "https://alfajores-forno.celo-testnet.org" | vercel env add ALFAJORES_RPC_URL production
echo "https://alfajores-forno.celo-testnet.org" | vercel env add NEXT_PUBLIC_ALFAJORES_RPC_URL production

# Treasury
echo "0xf229F3Dcea3D7cd3cA5ca41C4C50135D7b37F2b9" | vercel env add TREASURY_ADDRESS production
echo "0xf229F3Dcea3D7cd3cA5ca41C4C50135D7b37F2b9" | vercel env add NEXT_PUBLIC_TREASURY_ADDRESS production

echo "✅ All environment variables have been set in Vercel production!"
echo "🚀 You can now redeploy with: vercel --prod"
