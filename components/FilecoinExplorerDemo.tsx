import React, { useState } from 'react';
import { useLLMWithFilecoin } from '../hooks/useLLMWithFilecoin';

export const FilecoinExplorerDemo: React.FC = () => {
  const { 
    currentSession, 
    addMessage, 
    saveCurrentConversation, 
    filecoinConnected,
    lastSyncStatus,
    startNewConversation
  } = useLLMWithFilecoin();
  
  const [demoMessage, setDemoMessage] = useState('');

  const handleAddDemoMessage = () => {
    if (!demoMessage.trim()) return;
    
    addMessage({
      role: 'user',
      content: demoMessage
    });
    
    // Add a demo assistant response
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `Thanks for your message: "${demoMessage}". This conversation will be automatically saved to Filecoin with explorer links!`
      });
    }, 1000);
    
    setDemoMessage('');
  };

  const handleStartNewDemo = () => {
    startNewConversation({
      topic: 'Filecoin Explorer Demo',
      priority: 'high',
      tags: ['demo', 'filecoin', 'explorer', 'motusdao']
    });
  };

  const handleManualSave = async () => {
    try {
      await saveCurrentConversation();
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Filecoin Explorer Integration Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test the enhanced Filecoin storage integration with real explorer URLs
        </p>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${filecoinConnected ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'}`}>
          <div className="text-center">
            <div className="text-2xl mb-2">{filecoinConnected ? '🟢' : '🔴'}</div>
            <div className="text-sm font-medium">Filecoin Connection</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {filecoinConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          lastSyncStatus === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' :
          lastSyncStatus === 'failed' ? 'bg-red-50 border-red-200 dark:bg-red-900/20' :
          lastSyncStatus === 'pending' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20' :
          'bg-gray-50 border-gray-200 dark:bg-gray-900/20'
        }`}>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {lastSyncStatus === 'success' ? '✅' : 
               lastSyncStatus === 'failed' ? '❌' : 
               lastSyncStatus === 'pending' ? '🔄' : '⚪'}
            </div>
            <div className="text-sm font-medium">Last Sync</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {lastSyncStatus || 'No sync yet'}
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20">
          <div className="text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm font-medium">Messages</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentSession?.messages.length || 0} in session
            </div>
          </div>
        </div>
      </div>

      {/* Current Session Info */}
      {currentSession && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Current Session: {currentSession.metadata.topic || 'Untitled'}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Session Details</div>
              <div className="text-xs space-y-1">
                <div>ID: {currentSession.id}</div>
                <div>Messages: {currentSession.messages.length}</div>
                <div>Started: {new Date(currentSession.metadata.startedAt).toLocaleString()}</div>
                <div>Last Activity: {new Date(currentSession.metadata.lastActivity).toLocaleString()}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Filecoin Storage</div>
              <div className="text-xs space-y-1">
                {currentSession.filecoinCID ? (
                  <>
                    <div>CID: {currentSession.filecoinCID.substring(0, 25)}...</div>
                    <div>Saved: {currentSession.lastSavedAt ? new Date(currentSession.lastSavedAt).toLocaleString() : 'Never'}</div>
                  </>
                ) : (
                  <div>Not saved yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Explorer URLs */}
          {currentSession.explorerUrls && Object.keys(currentSession.explorerUrls).length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">🔗 Filecoin Explorer Links</div>
              <div className="flex flex-wrap gap-3">
                {currentSession.explorerUrls.cid && (
                  <a 
                    href={currentSession.explorerUrls.cid} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    🔍 View on Filscan
                  </a>
                )}
                
                {currentSession.explorerUrls.ipfs && (
                  <a 
                    href={currentSession.explorerUrls.ipfs} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                  >
                    📁 IPFS Gateway
                  </a>
                )}
                
                {currentSession.explorerUrls.cidDirect && (
                  <div className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg">
                    📋 CID: {currentSession.explorerUrls.cidDirect.substring(0, 15)}...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Demo Controls */}
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleStartNewDemo}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            🆕 Start New Demo Session
          </button>
          
          <button
            onClick={handleManualSave}
            disabled={!filecoinConnected || !currentSession || currentSession.messages.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            💾 Save to Filecoin Now
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={demoMessage}
            onChange={(e) => setDemoMessage(e.target.value)}
            placeholder="Type a demo message to add to the conversation..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddDemoMessage()}
          />
          <button
            onClick={handleAddDemoMessage}
            disabled={!demoMessage.trim()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ➕ Add Message
          </button>
        </div>

        {/* Recent Messages Preview */}
        {currentSession && currentSession.messages.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              📝 Recent Messages ({currentSession.messages.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentSession.messages.slice(-5).map((msg, idx) => (
                <div key={msg.id || idx} className={`p-2 rounded text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                    : 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                }`}>
                  <div className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {msg.role === 'user' ? '👤 User' : '🤖 Assistant'} • {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          🎯 How to Test Explorer Integration
        </h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
          <li>Start a new demo session or use the current one</li>
          <li>Add some demo messages using the input above</li>
          <li>Click "Save to Filecoin Now" to trigger manual storage</li>
          <li>Once saved, explorer links will appear above</li>
          <li>Click the "View on Filscan" link to see the data on the Filecoin explorer</li>
          <li>Use the "IPFS Gateway" link to access the raw data</li>
        </ol>
        <div className="mt-3 text-xs text-blue-700 dark:text-blue-300">
          💡 <strong>Note:</strong> Auto-save triggers every 5 minutes for active sessions with messages.
        </div>
      </div>
    </div>
  );
};
