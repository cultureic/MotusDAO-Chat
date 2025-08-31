import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { createLLMActor } from "../IC/LLM/index.js";
import { filecoinStorage } from "../services/filecoin-storage";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id?: string;
}

interface ConversationSession {
  id: string;
  messages: Message[];
  metadata: {
    topic?: string;
    priority?: 'high' | 'medium' | 'low';
    tags?: string[];
    userId?: string;
    sessionId?: string;
    startedAt: string;
    lastActivity: string;
  };
  filecoinCID?: string;
  lastSavedAt?: string;
  explorerUrls?: {
    cid?: string;
    cidDirect?: string;
    ipfs?: string;
    deal?: string;
  };
}

interface LLMWithFilecoinState {
  // LLM State
  llmActor: any;
  loading: boolean;
  error: string | null;
  model: string;
  isInitialized: boolean;
  
  // Conversation State
  currentSession: ConversationSession | null;
  conversations: ConversationSession[];
  
  // Filecoin State
  filecoinConnected: boolean;
  lastSyncStatus: 'success' | 'failed' | 'pending' | null;
  autoSaveEnabled: boolean;
  
  // Functions
  initializeActor: () => Promise<void>;
  chatComplete: (options: { model?: string; messages?: Message[] }) => Promise<any>;
  changeModel: (newModel: string) => void;
  
  // Conversation Management
  startNewConversation: (metadata?: Partial<ConversationSession['metadata']>) => void;
  addMessage: (message: Omit<Message, 'timestamp' | 'id'>) => void;
  loadConversation: (conversationId: string) => Promise<void>;
  
  // Filecoin Integration
  saveCurrentConversation: () => Promise<void>;
  queryStoredConversations: (params?: any) => Promise<any>;
  searchConversations: (searchTerm: string) => Promise<any>;
  getStorageAnalytics: () => Promise<any>;
  toggleAutoSave: () => void;
}

const LLMWithFilecoinContext = createContext<LLMWithFilecoinState | null>(null);

export const useLLMWithFilecoinLogic = (canisterId = "w36hm-eqaaa-aaaal-qr76a-cai") => {
  // LLM State
  const [llmActor, setLLMActor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState("llama3.1:8b");
  
  // Conversation State
  const [currentSession, setCurrentSession] = useState<ConversationSession | null>(null);
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  
  // Filecoin State
  const [filecoinConnected, setFilecoinConnected] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<'success' | 'failed' | 'pending' | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // Refs for intervals
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSaveAttempt = useRef<number>(0);

  // Initialize LLM Actor
  const initializeActor = async () => {
    try {
      setLoading(true);
      setError(null);
      const actor = await createLLMActor(canisterId);
      setLLMActor(actor);
    } catch (err: any) {
      setError(err.message);
      console.error("LLM Actor initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Filecoin connection
  const initializeFilecoin = async () => {
    try {
      const health = await filecoinStorage.healthCheck();
      setFilecoinConnected(true);
      console.log("✅ Filecoin storage connected:", health);
    } catch (error) {
      console.error("❌ Filecoin storage connection failed:", error);
      setFilecoinConnected(false);
    }
  };

  // Chat completion with automatic message tracking
  const chatComplete = async ({ model: requestModel, messages: requestMessages }: { model?: string; messages?: Message[] } = { model: 'llama3.1:8b', messages: [] }) => {
    if (!llmActor) throw new Error("LLM Actor not initialized");
    
    try {
      setLoading(true);
      console.log("Original messages:", requestMessages);

      // Use current session messages if no messages provided
      const messagesToSend = requestMessages || currentSession?.messages || [];
      
      // Transform messages to the expected format for real canister
      // Based on working example from Aidias app
      const transformedMessages = messagesToSend.map(msg => ({
        role: msg.role === 'user' ? { user: null } : 
              msg.role === 'assistant' ? { assistant: null } : 
              { system: null },
        content: msg.content
      }));
      
      console.log('📤 Transformed messages for canister:', transformedMessages);

      // Prepare the chat request with correct structure
      const chatRequest = {
        model: requestModel || model,
        messages: transformedMessages
      };

      console.log("Chat request being sent to canister:", chatRequest);
      const response = await llmActor.v0_chat(chatRequest);
      console.log("Raw chat response from canister:", response);
      
      // Handle both real canister response (direct string) and mock response (complex object)
      let assistantContent: string;
      
      if (typeof response === 'string') {
        // Real canister returns IDL.Text directly
        assistantContent = response;
        console.log('✅ Real canister response received:', assistantContent);
      } else if (response.Ok?.choices?.[0]?.message?.content) {
        // Mock response format
        assistantContent = response.Ok.choices[0].message.content;
        console.log('🤖 Mock response received:', assistantContent);
      } else {
        console.error('❌ Unexpected response format:', response);
        throw new Error('Unexpected response format from canister');
      }
      
      // Add assistant response to current session
      if (assistantContent && currentSession) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date().toISOString(),
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        addMessage(assistantMessage);
      }
      
      return response;
    } catch (err: any) {
      console.error("Chat completion error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start a new conversation session
  const startNewConversation = (metadata: Partial<ConversationSession['metadata']> = {}) => {
    const newSession: ConversationSession = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messages: [],
      metadata: {
        ...metadata,
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        priority: metadata.priority || 'medium',
        tags: metadata.tags || ['chat', 'llm']
      }
    };
    
    setCurrentSession(newSession);
    setConversations(prev => [newSession, ...prev]);
    console.log("🆕 New conversation started:", newSession.id);
  };

  // Add message to current session
  const addMessage = useCallback((message: Omit<Message, 'timestamp' | 'id'>) => {
    if (!currentSession) {
      // Auto-start a session if none exists
      startNewConversation();
      return;
    }

    const newMessage: Message = {
      ...message,
      timestamp: new Date().toISOString(),
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setCurrentSession(prev => {
      if (!prev) return null;
      
      const updatedSession = {
        ...prev,
        messages: [...prev.messages, newMessage],
        metadata: {
          ...prev.metadata,
          lastActivity: new Date().toISOString()
        }
      };
      
      // Update in conversations list too
      setConversations(prevConvs => 
        prevConvs.map(conv => 
          conv.id === prev.id ? updatedSession : conv
        )
      );
      
      return updatedSession;
    });

    console.log("💬 Message added:", newMessage);
  }, [currentSession]);

  // Save current conversation to Filecoin
  const saveCurrentConversation = async (): Promise<void> => {
    if (!currentSession || !filecoinConnected) {
      console.log("⚠️ Cannot save: no session or Filecoin not connected");
      return;
    }

    if (currentSession.messages.length === 0) {
      console.log("⚠️ Cannot save: no messages in session");
      return;
    }

    // Avoid saving too frequently
    const now = Date.now();
    if (now - lastSaveAttempt.current < 30000) { // 30 second minimum between saves
      console.log("⏱️ Skipping save: too recent");
      return;
    }

    try {
      setLastSyncStatus('pending');
      lastSaveAttempt.current = now;

      console.log("💾 Saving conversation to Filecoin:", currentSession.id);
      
      const conversationData = {
        id: currentSession.id,
        messages: currentSession.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        metadata: {
          ...currentSession.metadata,
          source: 'MotusDAO-Chat',
          llmModel: model,
          totalMessages: currentSession.messages.length
        }
      };

      const result = await filecoinStorage.storeConversationWithExplorer(conversationData);
      
      // Update session with Filecoin data and explorer links
      setCurrentSession(prev => {
        if (!prev) return null;
        
        const updated = {
          ...prev,
          filecoinCID: result.cid,
          lastSavedAt: result.storedAt,
          explorerUrls: result.explorerUrls || {}
        };
        
        // Update in conversations list
        setConversations(prevConvs => 
          prevConvs.map(conv => 
            conv.id === prev.id ? updated : conv
          )
        );
        
        return updated;
      });

      setLastSyncStatus('success');
      console.log("✅ Conversation saved to Filecoin:", result);
      
    } catch (error: any) {
      setLastSyncStatus('failed');
      console.error("❌ Failed to save conversation:", error);
      setError(`Save failed: ${error.message}`);
    }
  };

  // Load conversation from Filecoin
  const loadConversation = async (conversationId: string): Promise<void> => {
    try {
      setLoading(true);
      const conversationData = await filecoinStorage.getConversation(conversationId);
      
      const session: ConversationSession = {
        id: conversationData.id || conversationId,
        messages: conversationData.messages,
        metadata: {
          ...conversationData.metadata,
          startedAt: conversationData.metadata?.storedAt || new Date().toISOString(),
          lastActivity: new Date().toISOString()
        }
      };
      
      setCurrentSession(session);
      
      // Add to conversations list if not already there
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === session.id);
        return exists ? prev : [session, ...prev];
      });
      
      console.log("📥 Conversation loaded from Filecoin:", session.id);
    } catch (error: any) {
      console.error("❌ Failed to load conversation:", error);
      setError(`Load failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Query stored conversations
  const queryStoredConversations = async (params: any = {}) => {
    try {
      return await filecoinStorage.queryConversations(params);
    } catch (error: any) {
      console.error("❌ Query failed:", error);
      throw error;
    }
  };

  // Search conversations
  const searchConversations = async (searchTerm: string) => {
    try {
      return await filecoinStorage.searchContent(searchTerm);
    } catch (error: any) {
      console.error("❌ Search failed:", error);
      throw error;
    }
  };

  // Get storage analytics
  const getStorageAnalytics = async () => {
    try {
      return await filecoinStorage.getAnalytics();
    } catch (error: any) {
      console.error("❌ Analytics failed:", error);
      throw error;
    }
  };

  // Toggle auto-save
  const toggleAutoSave = () => {
    setAutoSaveEnabled(prev => !prev);
  };

  // Change model
  const changeModel = (newModel: string) => {
    setModel(newModel);
  };

  // Auto-save effect (every 5 minutes)
  useEffect(() => {
    if (autoSaveEnabled && filecoinConnected) {
      autoSaveInterval.current = setInterval(() => {
        if (currentSession && currentSession.messages.length > 0) {
          console.log("⏰ Auto-save triggered");
          saveCurrentConversation().catch(console.error);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => {
        if (autoSaveInterval.current) {
          clearInterval(autoSaveInterval.current);
        }
      };
    }
  }, [autoSaveEnabled, filecoinConnected, currentSession]);

  // Initialize on mount
  useEffect(() => {
    initializeActor();
    initializeFilecoin();
    
    // Start a default session
    startNewConversation({
      topic: 'MotusDAO Chat Session',
      tags: ['motusdao', 'chat', 'session']
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, []);

  return {
    // LLM State
    llmActor,
    loading,
    error,
    model,
    isInitialized: !!llmActor,
    
    // Conversation State
    currentSession,
    conversations,
    
    // Filecoin State
    filecoinConnected,
    lastSyncStatus,
    autoSaveEnabled,
    
    // Functions
    initializeActor,
    chatComplete,
    changeModel,
    
    // Conversation Management
    startNewConversation,
    addMessage,
    loadConversation,
    
    // Filecoin Integration
    saveCurrentConversation,
    queryStoredConversations,
    searchConversations,
    getStorageAnalytics,
    toggleAutoSave,
  };
};

export const LLMWithFilecoinProvider = ({ children, canisterId }: { children: React.ReactNode; canisterId?: string }) => {
  const llmWithFilecoin = useLLMWithFilecoinLogic(canisterId);
  return (
    <LLMWithFilecoinContext.Provider value={llmWithFilecoin}>
      {children}
    </LLMWithFilecoinContext.Provider>
  );
};

export const useLLMWithFilecoin = () => {
  const context = useContext(LLMWithFilecoinContext);
  if (!context) {
    throw new Error("useLLMWithFilecoin must be used within an LLMWithFilecoinProvider");
  }
  return context;
};

// Backward compatibility with original hook
export const useLLMActorLogic = useLLMWithFilecoinLogic;
export const LLMActorProvider = LLMWithFilecoinProvider;
export const useLLMActor = useLLMWithFilecoin;
