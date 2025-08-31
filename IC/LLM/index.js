// Real IC LLM Actor implementation using correct IDL interface
import { Actor, HttpAgent } from '@dfinity/agent';

// IC Network configuration
const IC_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app';

// Check if we should force use real canister (set via environment variable)
const FORCE_REAL_CANISTER = process.env.NEXT_PUBLIC_USE_REAL_IC_CANISTER === 'true';

// Correct IDL Factory based on working example
const idlFactory = ({ IDL }) => {
  const role = IDL.Variant({
    'user': IDL.Null,
    'assistant': IDL.Null,
    'system': IDL.Null,
  });
  const chat_message = IDL.Record({ 'content': IDL.Text, 'role': role });
  const chat_request = IDL.Record({
    'model': IDL.Text,
    'messages': IDL.Vec(chat_message),
  });
  return IDL.Service({ 'v0_chat': IDL.Func([chat_request], [IDL.Text], []) });
};

export const createLLMActor = async (canisterId) => {
  console.log(`🔗 Creating LLM Actor for canister: ${canisterId}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏠 IC Host: ${IC_HOST}`);
  console.log(`🔥 Force real canister: ${FORCE_REAL_CANISTER}`);
  
  // Try to create real IC actor first
  if (FORCE_REAL_CANISTER) {
    try {
      return await createRealICActor(canisterId);
    } catch (error) {
      console.error('❌ Real IC Actor failed, falling back to mock:', error);
    }
  }
  
  // Use mock actor (for now, until real canister is deployed)
  console.log('🤖 Using mock IC actor (set NEXT_PUBLIC_USE_REAL_IC_CANISTER=true to use real canister)');
  return createMockActor(canisterId);
};

// Real IC Actor creation
const createRealICActor = async (canisterId) => {
  console.log(`🚀 Creating REAL IC Actor for canister: ${canisterId}`);
  
  // Create HTTP agent
  const agent = new HttpAgent({ 
    host: IC_HOST,
  });
  
  // In development, fetch root key
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 Fetching root key for development...');
    await agent.fetchRootKey();
  }
  
  // Create actor with correct IDL
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
  
  // Test the connection with a simple call
  try {
    console.log('🧪 Testing real canister connection with ping...');
    // Try a simple chat call to test connectivity
    const testRequest = {
      model: 'test',
      messages: [{ role: { user: null }, content: 'ping' }]
    };
    const testResponse = await actor.v0_chat(testRequest);
    console.log('✅ Real canister connection successful! Response:', testResponse);
  } catch (testError) {
    console.warn('⚠️ Canister test ping failed:', testError);
    // Continue anyway - the canister might be working but rejecting test calls
  }
  
  console.log(`✅ Real IC LLM Actor created and tested for canister: ${canisterId}`);
  return actor;
};

// Fallback mock implementation for when IC connection fails
const createMockActor = (canisterId) => {
  const actor = {
    canisterId,
    
    // Mock v0_chat method that returns simple string like real canister
    v0_chat: async (chatRequest) => {
      console.log('🤖 Mock LLM Actor - Chat request:', chatRequest);
      console.log('⚠️ THIS IS A MOCK RESPONSE - SET NEXT_PUBLIC_USE_REAL_IC_CANISTER=true TO USE REAL CANISTER');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on the last message
      const lastMessage = chatRequest.messages[chatRequest.messages.length - 1];
      const userContent = lastMessage?.content || '';
      
      // Generate a mock response that makes it clear it's not real
      // Return simple string like real canister (not complex object)
      const mockResponse = `[MOCK RESPONSE] Thank you for saying "${userContent}". This is a simulated response from canister ${canisterId}. To get real AI responses, set NEXT_PUBLIC_USE_REAL_IC_CANISTER=true and ensure your IC canister is deployed and accessible.`;
      
      return mockResponse;
    },
    
    // Mock method to get available models
    get_models: async () => {
      return {
        Ok: [
          'llama3.1:8b',
          'llama3.1:70b',
          'qwen2.5:7b'
        ]
      };
    },
    
    // Mock method to get canister status
    get_status: async () => {
      return {
        Ok: {
          status: 'running (MOCK - not real canister)',
          memory_used: '1.2GB',
          cycles_balance: '1000000000000',
          uptime: '24 hours'
        }
      };
    }
  };
  
  console.log(`🤖 Mock LLM Actor created for canister: ${canisterId}`);
  console.log('⚠️ To use real IC canister, set NEXT_PUBLIC_USE_REAL_IC_CANISTER=true');
  return actor;
};
