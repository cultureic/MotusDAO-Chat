interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ConversationMetadata {
  topic?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

interface ConversationData {
  id?: string;
  messages: Message[];
  metadata?: ConversationMetadata;
}

interface StorageResult {
  conversationId: string;
  cid: string;
  dealCID?: string;
  storedAt: string;
  status: 'deal_created' | 'imported_only';
  explorerUrls?: {
    cid?: string;
    cidDirect?: string;
    ipfs?: string;
    deal?: string;
  };
}

interface QueryParams {
  topic?: string;
  priority?: string;
  tags?: string | string[];
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
}

class FilecoinStorageService {
  private baseUrl: string;
  private apiKey?: string;
  private explorerBaseUrl: string;

  constructor(
    baseUrl: string = 'https://filecoin-conversation-storage.vercel.app', 
    apiKey?: string,
    explorerUrl: string = 'https://calibration.filscan.io'
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
    this.apiKey = apiKey;
    this.explorerBaseUrl = explorerUrl;
  }

  private async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Filecoin storage API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Store a conversation on Filecoin
   */
  async storeConversation(conversationData: ConversationData): Promise<StorageResult> {
    const result = await this.apiCall('/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData)
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to store conversation');
    }

    return result.data;
  }

  /**
   * Retrieve a conversation by ID
   */
  async getConversation(conversationId: string): Promise<ConversationData> {
    const result = await this.apiCall(`/conversations/${conversationId}`);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to retrieve conversation');
    }

    return result.data;
  }

  /**
   * List all conversations
   */
  async listConversations(): Promise<any[]> {
    const result = await this.apiCall('/conversations');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to list conversations');
    }

    return result.data;
  }

  /**
   * Query conversations with filters
   */
  async queryConversations(params: QueryParams = {}): Promise<any> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/query/conversations${queryString ? `?${queryString}` : ''}`;
    
    const result = await this.apiCall(endpoint);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to query conversations');
    }

    return result.data;
  }

  /**
   * Search message content
   */
  async searchContent(searchTerm: string, limit: number = 50): Promise<any> {
    const result = await this.apiCall(`/query/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to search content');
    }

    return result.data;
  }

  /**
   * Get storage analytics
   */
  async getAnalytics(): Promise<any> {
    const result = await this.apiCall('/query/analytics');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get analytics');
    }

    return result.data;
  }

  /**
   * Get all topics
   */
  async getTopics(): Promise<string[]> {
    const result = await this.apiCall('/query/topics');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get topics');
    }

    return result.data.topics;
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    const result = await this.apiCall('/query/tags');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get tags');
    }

    return result.data.tags;
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<any> {
    const result = await this.apiCall('/stats');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get stats');
    }

    return result.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    const result = await this.apiCall('/health');
    return result;
  }

  /**
   * Get Filecoin explorer URL for a CID
   */
  getExplorerUrl(cid: string): string {
    return `${this.explorerBaseUrl}/en/deal/${cid}`;
  }

  /**
   * Get Filecoin explorer URL for a transaction/message
   */
  getTransactionUrl(transactionHash: string): string {
    return `${this.explorerBaseUrl}/en/message/${transactionHash}`;
  }

  /**
   * Get Filecoin explorer URL for an address
   */
  getAddressUrl(address: string): string {
    return `${this.explorerBaseUrl}/en/address/${address}`;
  }

  /**
   * Store conversation and return with explorer links
   */
  async storeConversationWithExplorer(conversationData: ConversationData): Promise<StorageResult & { explorerUrls: { cid: string; deal?: string } }> {
    const result = await this.storeConversation(conversationData);
    
    const explorerUrls = {
      cid: this.getExplorerUrl(result.cid),
      ...(result.dealCID && { deal: this.getExplorerUrl(result.dealCID) })
    };

    return {
      ...result,
      explorerUrls
    };
  }
}

// Export singleton instance
export const filecoinStorage = new FilecoinStorageService();

export default FilecoinStorageService;
