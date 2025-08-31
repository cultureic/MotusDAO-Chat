// Real IC LLM Actor implementation
// IC Network configuration
const IC_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app';

// Check if we should force use real canister (set via environment variable)
const FORCE_REAL_CANISTER = process.env.NEXT_PUBLIC_USE_REAL_IC_CANISTER === 'true';

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
  // Dynamic import of IC dependencies
  const { Actor, HttpAgent } = await import('@dfinity/agent');
  
  if (!Actor || !HttpAgent) {
    throw new Error('IC dependencies not available');
  }
  
  // Define the canister interface (IDL)
  const idlFactory = ({ IDL }) => {
    const ChatMessage = IDL.Record({
      role: IDL.Variant({ user: IDL.Null, assistant: IDL.Null }),
      content: IDL.Text
    });
    
    const ChatRequest = IDL.Record({
      model: IDL.Text,
      messages: IDL.Vec(ChatMessage)
    });
    
    const ChatChoice = IDL.Record({
      index: IDL.Nat,
      message: ChatMessage,
      finish_reason: IDL.Variant({ stop: IDL.Null, length: IDL.Null })
    });
    
    const Usage = IDL.Record({
      prompt_tokens: IDL.Nat,
      completion_tokens: IDL.Nat,
      total_tokens: IDL.Nat
    });
    
    const ChatResponse = IDL.Record({
      id: IDL.Text,
      model: IDL.Text,
      created: IDL.Nat,
      choices: IDL.Vec(ChatChoice),
      usage: Usage
    });
    
    const Result = IDL.Variant({
      Ok: ChatResponse,
      Err: IDL.Text
    });
    
    return IDL.Service({
      v0_chat: IDL.Func([ChatRequest], [Result], ['update']),
      get_models: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
      get_status: IDL.Func([], [IDL.Text], ['query'])
    });
  };
  
  // Create HTTP agent
  const agent = new HttpAgent({ 
    host: IC_HOST,
  });
  
  // In development, fetch root key
  if (process.env.NODE_ENV === 'development') {
    await agent.fetchRootKey();
  }
  
  // Create actor
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
  
  // Test the connection
  try {
    console.log('🧪 Testing real canister connection...');
    const status = await actor.get_status();
    console.log('✅ Real canister connection successful:', status);
  } catch (testError) {
    console.warn('⚠️ Canister test failed, but actor created:', testError);
    // Continue anyway - the canister might not have get_status method
  }
  
  console.log(`✅ Real IC LLM Actor created for canister: ${canisterId}`);
  return actor;
};

// Fallback mock implementation for when IC connection fails
const createMockActor = (canisterId) => {
  const actor = {
    canisterId,
    
    // Mock v0_chat method that clearly indicates it's a mock
    v0_chat: async (chatRequest) => {
      console.log('🤖 Mock LLM Actor - Chat request:', chatRequest);
      console.log('⚠️ THIS IS A MOCK RESPONSE - SET NEXT_PUBLIC_USE_REAL_IC_CANISTER=true TO USE REAL CANISTER');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on the last message
      const lastMessage = chatRequest.messages[chatRequest.messages.length - 1];
      const userContent = lastMessage?.content || '';
      
      // Generate a mock response that makes it clear it's not real
      const mockResponse = `[MOCK RESPONSE] Thank you for saying "${userContent}". This is a simulated response from canister ${canisterId}. To get real AI responses, set NEXT_PUBLIC_USE_REAL_IC_CANISTER=true and ensure your IC canister is deployed and accessible.`;
      
      return {
        Ok: {
          id: `mock-chat-${Date.now()}`,
          model: chatRequest.model,
          created: Math.floor(Date.now() / 1000),
          choices: [{
            index: 0,
            message: {
              role: { assistant: null },
              content: mockResponse
            },
            finish_reason: { stop: null }
          }],
          usage: {
            prompt_tokens: userContent.length,
            completion_tokens: mockResponse.length,
            total_tokens: userContent.length + mockResponse.length
          }
        }
      };
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
