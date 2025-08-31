# Filecoin Storage Integration with Explorer URLs

This document outlines the complete Filecoin integration for MotusDAO-Chat, including the new explorer URL functionality that provides direct links to view stored conversations on the Filecoin blockchain explorer.

## 🌟 New Features

### Explorer URL Integration
- **Real Filecoin Explorer Links**: Every stored conversation now includes direct links to view the data on Filscan
- **IPFS Gateway Access**: Direct links to access conversation data via IPFS gateways
- **CID Tracking**: Full Content Identifier (CID) tracking with explorer navigation
- **Transaction Visibility**: See your conversation storage transactions on the Filecoin blockchain

### Auto-Save with Explorer Links
- **5-minute Auto-save**: Conversations automatically saved to Filecoin every 5 minutes
- **Instant Explorer Access**: Explorer links generated immediately after storage
- **Storage Verification**: Visual confirmation of successful Filecoin storage with clickable links

## 📁 Project Structure

```
MotusDAO-Chat/
├── hooks/
│   └── useLLMWithFilecoin.tsx          # Enhanced LLM hook with Filecoin + Explorer URLs
├── services/
│   └── filecoin-storage.ts             # Filecoin storage service with explorer integration
├── components/
│   ├── FilecoinQueryPanel.tsx          # Storage management UI with explorer links
│   └── FilecoinExplorerDemo.tsx        # Demo component showcasing explorer integration
├── IC/LLM/
│   └── index.js                        # Mock IC LLM actor for development
└── FILECOIN_INTEGRATION.md             # This documentation
```

## 🔧 Components Overview

### 1. Enhanced LLM Hook (`hooks/useLLMWithFilecoin.tsx`)

**Key Features:**
- Integrates IC LLM with Filecoin storage
- Auto-saves conversations every 5 minutes
- Captures and stores explorer URLs for each saved conversation
- Provides comprehensive conversation management

**New Explorer URL Properties:**
```typescript
interface ConversationSession {
  // ... existing properties
  explorerUrls?: {
    cid?: string;        // Filscan explorer URL for the CID
    cidDirect?: string;  // Direct CID string
    ipfs?: string;       // IPFS gateway URL
    deal?: string;       // Deal explorer URL (if applicable)
  };
}
```

**Usage:**
```typescript
const {
  currentSession,
  saveCurrentConversation,
  filecoinConnected,
  lastSyncStatus
} = useLLMWithFilecoin();

// Access explorer URLs after saving
if (currentSession?.explorerUrls?.cid) {
  // Direct link to Filscan explorer
  window.open(currentSession.explorerUrls.cid, '_blank');
}
```

### 2. Filecoin Storage Service (`services/filecoin-storage.ts`)

**Enhanced Methods:**
- `storeConversationWithExplorer()`: Stores conversation and returns explorer URLs
- `getExplorerUrl()`: Generates Filscan explorer URLs for CIDs
- `getTransactionUrl()`: Creates transaction explorer links
- `getAddressUrl()`: Creates address explorer links

**Configuration:**
```typescript
const filecoinStorage = new FilecoinStorageService(
  'https://filecoin-conversation-storage.vercel.app',  // Backend URL
  undefined,                                            // API key (optional)
  'https://calibration.filscan.io'                     // Explorer base URL
);
```

### 3. Filecoin Query Panel (`components/FilecoinQueryPanel.tsx`)

**Explorer URL Display:**
- Shows clickable explorer links in the active session panel
- Displays storage status with visual indicators
- Provides direct access to Filscan and IPFS gateway

**Visual Features:**
- 🔗 Explorer link buttons with hover effects
- 📁 IPFS gateway access
- ✅ Storage confirmation indicators
- 🔄 Real-time sync status

### 4. Demo Component (`components/FilecoinExplorerDemo.tsx`)

**Test Features:**
- Interactive message addition
- Manual save triggering
- Real-time explorer URL display
- Connection status monitoring

## 🚀 Getting Started

### 1. Setup the Integration

Add the provider to your app layout:

```typescript
// In your main layout or App.tsx
import { LLMWithFilecoinProvider } from './hooks/useLLMWithFilecoin';

export default function App({ children }) {
  return (
    <LLMWithFilecoinProvider canisterId="your-canister-id">
      {children}
    </LLMWithFilecoinProvider>
  );
}
```

### 2. Use in Components

```typescript
// In any component
import { useLLMWithFilecoin } from '../hooks/useLLMWithFilecoin';
import { FilecoinQueryPanel } from '../components/FilecoinQueryPanel';

export function ChatComponent() {
  const { 
    currentSession, 
    addMessage, 
    saveCurrentConversation,
    filecoinConnected 
  } = useLLMWithFilecoin();

  const handleSendMessage = (content: string) => {
    addMessage({ role: 'user', content });
    // Auto-save will happen every 5 minutes, or trigger manual save
  };

  return (
    <div>
      {/* Your chat UI */}
      
      {/* Filecoin Storage Panel */}
      <FilecoinQueryPanel className="mt-4" />
      
      {/* Show explorer links when available */}
      {currentSession?.explorerUrls?.cid && (
        <div className="mt-2">
          <a 
            href={currentSession.explorerUrls.cid} 
            target="_blank" 
            className="text-blue-500 hover:underline"
          >
            🔗 View conversation on Filecoin Explorer
          </a>
        </div>
      )}
    </div>
  );
}
```

### 3. Test the Integration

```typescript
// Use the demo component
import { FilecoinExplorerDemo } from '../components/FilecoinExplorerDemo';

// Add to any page to test
<FilecoinExplorerDemo />
```

## 🔗 Explorer URL Types

### Filscan Explorer (Default: Calibration Network)
- **Base URL**: `https://calibration.filscan.io`
- **Deal URL**: `https://calibration.filscan.io/en/deal/{cid}`
- **Transaction URL**: `https://calibration.filscan.io/en/message/{hash}`
- **Address URL**: `https://calibration.filscan.io/en/address/{address}`

### IPFS Gateway
- **Gateway URL**: `https://ipfs.io/ipfs/{cid}`
- **Direct access to stored conversation data**

## 📊 Storage Analytics

The integration provides comprehensive analytics:

```typescript
const analytics = await getStorageAnalytics();

// Analytics structure:
{
  overview: {
    totalConversations: number,
    totalMessages: number,
    averageMessagesPerConversation: number
  },
  storage: {
    estimatedSize: string  // e.g., "125.3 KB"
  },
  topics: [topic, count][],
  priorities: {
    high: number,
    medium: number,
    low: number
  }
}
```

## 🔍 Query and Search

### Search Message Content
```typescript
const searchResults = await searchConversations("blockchain");
// Returns highlighted matches with conversation context
```

### Query with Filters
```typescript
const queryResults = await queryStoredConversations({
  topic: "technical discussion",
  priority: "high",
  tags: ["blockchain", "filecoin"],
  limit: 20
});
```

## 🛠 Backend Integration

The frontend connects to a deployed Filecoin storage service that:
- Stores conversations on Filecoin network
- Generates real CIDs and deal IDs
- Provides explorer URLs for stored content
- Maintains conversation searchability and analytics

### Backend Endpoints
- `POST /conversations` - Store conversation with explorer URLs
- `GET /conversations/{id}` - Retrieve conversation
- `GET /query/conversations` - Query with filters
- `GET /query/search` - Search content
- `GET /query/analytics` - Get storage analytics
- `GET /health` - Health check

## 🎯 Integration Benefits

### For Users
- **Transparency**: See exactly where conversations are stored on Filecoin
- **Verification**: Click explorer links to verify storage on blockchain
- **Persistence**: Conversations permanently stored on decentralized network
- **Searchability**: Find past conversations with powerful search

### For Developers
- **Real Integration**: Actual Filecoin storage, not just mock data
- **Explorer Links**: Direct blockchain verification
- **Comprehensive API**: Full CRUD operations with analytics
- **Auto-save**: Seamless background storage

## 🔧 Configuration Options

### Explorer Network Configuration
```typescript
// For mainnet
const filecoinStorage = new FilecoinStorageService(
  'https://your-backend.vercel.app',
  undefined,
  'https://filscan.io'  // Mainnet explorer
);

// For calibration testnet (default)
const filecoinStorage = new FilecoinStorageService(
  'https://your-backend.vercel.app',
  undefined,
  'https://calibration.filscan.io'  // Testnet explorer
);
```

### Auto-save Timing
```typescript
// Modify auto-save interval (default: 5 minutes)
useEffect(() => {
  if (autoSaveEnabled && filecoinConnected) {
    const interval = setInterval(() => {
      saveCurrentConversation();
    }, 3 * 60 * 1000); // 3 minutes instead of 5
    
    return () => clearInterval(interval);
  }
}, [autoSaveEnabled, filecoinConnected]);
```

## 📝 Example Integration Flow

1. **User starts conversation** → New session created
2. **User sends messages** → Messages added to session
3. **Auto-save triggers** (every 5 minutes) → Conversation stored to Filecoin
4. **Explorer URLs generated** → Links to Filscan and IPFS provided
5. **User can click links** → View stored data on blockchain explorer
6. **Conversation searchable** → Can query and search stored conversations

## 🔒 Security Considerations

- **No API Keys Required**: Frontend connects securely to backend service
- **CORS Configured**: Proper cross-origin request handling
- **Input Validation**: All user inputs validated before storage
- **Error Handling**: Comprehensive error handling with user feedback

## 🐛 Troubleshooting

### Common Issues

**Explorer Links Not Appearing:**
- Check if `filecoinConnected` is true
- Verify conversation has been saved (`lastSyncStatus === 'success'`)
- Ensure backend is returning `explorerUrls` in response

**Auto-save Not Working:**
- Check `autoSaveEnabled` is true
- Verify Filecoin connection
- Check console for save errors
- Ensure session has messages

**Backend Connection Issues:**
- Verify backend URL in `services/filecoin-storage.ts`
- Check network connectivity
- Review console for API errors

### Debug Commands
```typescript
// Check connection status
console.log('Filecoin connected:', filecoinConnected);

// View current session with explorer URLs
console.log('Current session:', currentSession);

// Test storage service directly
filecoinStorage.healthCheck().then(console.log);
```

## 🚀 Future Enhancements

- **Mainnet Deployment**: Switch to Filecoin mainnet for production
- **Deal Status Tracking**: Monitor storage deal status in real-time
- **Retrieval Testing**: Verify data retrievability from Filecoin
- **Advanced Analytics**: More detailed storage and usage analytics
- **Multiple Explorer Support**: Support for different Filecoin explorers

---

## Summary

The MotusDAO-Chat project now has full Filecoin integration with real explorer URL support. Users can:
- Have conversations automatically saved to Filecoin every 5 minutes
- See direct links to view their stored data on the Filecoin blockchain explorer
- Search and query past conversations stored on the decentralized network
- Access conversation data via IPFS gateways
- Verify storage authenticity through blockchain transaction links

This provides true decentralized conversation storage with full transparency and verifiability through blockchain explorer integration.
