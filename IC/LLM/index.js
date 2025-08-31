// Mock IC LLM Actor for demonstration
// In a real implementation, this would use @dfinity/agent and connect to IC canisters

export const createLLMActor = async (canisterId) => {
  // Simulate actor creation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock actor implementation
  const actor = {
    canisterId,
    
    // Mock v0_chat method
    v0_chat: async (chatRequest) => {
      console.log('Mock LLM Actor - Chat request:', chatRequest);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on the last message
      const lastMessage = chatRequest.messages[chatRequest.messages.length - 1];
      const userContent = lastMessage?.content || '';
      
      // Generate a mock response
      const responses = [
        `Thank you for your message: "${userContent.substring(0, 50)}...". This is a mock response from the ${chatRequest.model} model.`,
        `I understand you're asking about: "${userContent.substring(0, 30)}...". This is a simulated LLM response.`,
        `Based on your input: "${userContent.substring(0, 40)}...", here's my mock response from the IC canister.`
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return {
        Ok: {
          id: `chat-${Date.now()}`,
          model: chatRequest.model,
          created: Math.floor(Date.now() / 1000),
          choices: [{
            index: 0,
            message: {
              role: { assistant: null },
              content: randomResponse
            },
            finish_reason: { stop: null }
          }],
          usage: {
            prompt_tokens: userContent.length,
            completion_tokens: randomResponse.length,
            total_tokens: userContent.length + randomResponse.length
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
          'mistral:7b',
          'codellama:13b'
        ]
      };
    },
    
    // Mock method to get canister status
    get_status: async () => {
      return {
        Ok: {
          status: 'running',
          memory_used: '1.2GB',
          cycles_balance: '1000000000000',
          uptime: '24 hours'
        }
      };
    }
  };
  
  console.log(`Mock LLM Actor created for canister: ${canisterId}`);
  return actor;
};
