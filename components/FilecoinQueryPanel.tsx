import React, { useState, useEffect } from 'react';
import { useLLMWithFilecoin } from '../hooks/useLLMWithFilecoin';

interface QueryPanelProps {
  className?: string;
}

export const FilecoinQueryPanel: React.FC<QueryPanelProps> = ({ className = '' }) => {
  const {
    filecoinConnected,
    lastSyncStatus,
    autoSaveEnabled,
    currentSession,
    conversations,
    queryStoredConversations,
    searchConversations,
    getStorageAnalytics,
    loadConversation,
    toggleAutoSave,
    saveCurrentConversation
  } = useLLMWithFilecoin();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'query' | 'analytics' | 'sessions'>('sessions');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    topic: '',
    priority: '',
    tags: '',
    limit: 10
  });

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getStorageAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      const results = await searchConversations(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filters.topic) params.topic = filters.topic;
      if (filters.priority) params.priority = filters.priority;
      if (filters.tags) params.tags = filters.tags.split(',').map(t => t.trim());
      if (filters.limit) params.limit = filters.limit;
      
      const results = await queryStoredConversations(params);
      setQueryResults(results);
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadConversation = async (conversationId: string) => {
    try {
      await loadConversation(conversationId);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSyncStatusIcon = () => {
    switch (lastSyncStatus) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'pending': return '🔄';
      default: return '⚪';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            🗄️ Filecoin Storage
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${filecoinConnected ? 'text-green-600' : 'text-red-600'}`}>
              {filecoinConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
            <span className="text-sm text-gray-500">
              {getSyncStatusIcon()} Sync
            </span>
          </div>
        </div>
        
        {/* Auto-save status */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Auto-save: {autoSaveEnabled ? '🟢 ON' : '🔴 OFF'}
            </span>
            <button
              onClick={toggleAutoSave}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Toggle
            </button>
          </div>
          
          {currentSession && (
            <button
              onClick={saveCurrentConversation}
              className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!filecoinConnected}
            >
              Save Now
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'sessions', label: '💬 Sessions', count: conversations.length },
          { key: 'search', label: '🔍 Search', count: searchResults?.totalMatches },
          { key: 'query', label: '🎛️ Query', count: queryResults?.conversations?.length },
          { key: 'analytics', label: '📊 Analytics', count: analytics?.overview?.totalConversations }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Current Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Current Sessions</h4>
              <span className="text-sm text-gray-500">{conversations.length} sessions</span>
            </div>
            
            {currentSession && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    🟢 Active: {currentSession.metadata.topic || 'Untitled'}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    {currentSession.messages.length} messages
                  </span>
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  ID: {currentSession.id}
                  {currentSession.filecoinCID && (
                    <div>CID: {currentSession.filecoinCID.substring(0, 20)}...</div>
                  )}
                  {currentSession.lastSavedAt && (
                    <div>Last saved: {formatTimestamp(currentSession.lastSavedAt)}</div>
                  )}
                  {currentSession.explorerUrls && Object.keys(currentSession.explorerUrls).length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium mb-1">Filecoin Explorer:</div>
                      <div className="flex flex-wrap gap-2">
                        {currentSession.explorerUrls.cid && (
                          <a 
                            href={currentSession.explorerUrls.cid} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            🔗 View Deal
                          </a>
                        )}
                        {currentSession.explorerUrls.ipfs && (
                          <a 
                            href={currentSession.explorerUrls.ipfs} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 underline"
                          >
                            📁 IPFS Gateway
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {conversations.filter(conv => conv.id !== currentSession?.id).map(conv => (
              <div
                key={conv.id}
                className="border border-gray-200 dark:border-gray-700 rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleLoadConversation(conv.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {conv.metadata.topic || 'Untitled'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {conv.messages.length} msgs
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {formatTimestamp(conv.metadata.lastActivity)}
                  {conv.filecoinCID && <span className="text-green-600"> • Stored</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search message content..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !searchTerm.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? '🔄' : '🔍'}
              </button>
            </div>
            
            {searchResults && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Found {searchResults.totalMatches} matches in {searchResults.conversationsFound} conversations
                </div>
                {searchResults.results?.map((result: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded p-3">
                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                      {result.conversationTopic} ({result.matchCount} matches)
                    </div>
                    {result.matches?.slice(0, 2).map((match: any, matchIdx: number) => (
                      <div key={matchIdx} className="bg-gray-50 dark:bg-gray-700 rounded p-2 mb-2 text-xs">
                        <div className="text-gray-600 dark:text-gray-400 mb-1">
                          {match.role} • Message {match.messageIndex + 1}
                        </div>
                        <div 
                          className="text-gray-800 dark:text-gray-200"
                          dangerouslySetInnerHTML={{
                            __html: match.highlightedContent?.replace(/\*\*(.*?)\*\*/g, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>')
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Query Tab */}
        {activeTab === 'query' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Topic"
                value={filters.topic}
                onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={filters.tags}
                onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
              <input
                type="number"
                placeholder="Limit"
                value={filters.limit}
                onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) || 10 }))}
                min="1"
                max="50"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
            </div>
            
            <button
              onClick={handleQuery}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? '🔄 Querying...' : '🎛️ Apply Filters'}
            </button>
            
            {queryResults && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Found {queryResults.conversations?.length} of {queryResults.pagination?.total} conversations
                </div>
                {queryResults.conversations?.map((conv: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-gray-700 rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleLoadConversation(conv.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {conv.topic || 'Untitled'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        conv.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        conv.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {conv.priority || 'N/A'}
                      </span>
                    </div>
                    
                    {conv.tags && conv.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {conv.tags.map((tag: string, tagIdx: number) => (
                          <span
                            key={tagIdx}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {conv.messageCount} messages • {formatTimestamp(conv.storedAt)}
                    </div>
                    
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
                      {conv.lastMessage}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Storage Analytics</h4>
              <button
                onClick={loadAnalytics}
                disabled={loading}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
              >
                🔄 Refresh
              </button>
            </div>
            
            {analytics && (
              <div className="space-y-3">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {analytics.overview?.totalConversations || 0}
                    </div>
                    <div className="text-xs text-blue-800 dark:text-blue-200">Conversations</div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {analytics.overview?.totalMessages || 0}
                    </div>
                    <div className="text-xs text-green-800 dark:text-green-200">Messages</div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-3 text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {analytics.storage?.estimatedSize || '0 KB'}
                    </div>
                    <div className="text-xs text-purple-800 dark:text-purple-200">Storage Used</div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-3 text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {analytics.overview?.averageMessagesPerConversation?.toFixed(1) || 0}
                    </div>
                    <div className="text-xs text-orange-800 dark:text-orange-200">Avg Messages</div>
                  </div>
                </div>

                {/* Top Topics */}
                {analytics.topics && analytics.topics.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Top Topics</h5>
                    <div className="space-y-1">
                      {analytics.topics.slice(0, 5).map(([topic, count]: [string, number], idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Distribution */}
                {analytics.priorities && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Priority Distribution</h5>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-red-600">High: {analytics.priorities.high}</span>
                      <span className="text-yellow-600">Medium: {analytics.priorities.medium}</span>
                      <span className="text-green-600">Low: {analytics.priorities.low}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Current Session Info */}
      {currentSession && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <div>Current: {currentSession.metadata.topic || 'Untitled'}</div>
            <div>Messages: {currentSession.messages.length}</div>
            <div>Last activity: {formatTimestamp(currentSession.metadata.lastActivity)}</div>
            {currentSession.filecoinCID && (
              <div>Filecoin CID: {currentSession.filecoinCID.substring(0, 30)}...</div>
            )}
            {currentSession.explorerUrls && Object.keys(currentSession.explorerUrls).length > 0 && (
              <div className="mt-2 flex gap-3">
                {currentSession.explorerUrls.cid && (
                  <a 
                    href={currentSession.explorerUrls.cid} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    🔗 Explorer
                  </a>
                )}
                {currentSession.explorerUrls.ipfs && (
                  <a 
                    href={currentSession.explorerUrls.ipfs} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 underline"
                  >
                    📁 IPFS
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
