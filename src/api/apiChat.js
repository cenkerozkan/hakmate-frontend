// src/api/apiChat.js - Optimize edilmiş mesajlaşma
import axios from "axios";
import { AuthAPI } from "./api";

// Kararlılık ayarları
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY = 500;
const REQUEST_TIMEOUT = 10000;

// CORS durumu tracking
let corsIssueDetected = false;
let consecutiveAxiosFailures = 0;
let lastSuccessfulMethod = 'axios'; // 'axios' veya 'fetch'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Chat service axios instance
const chatServiceAxios = axios.create({
  baseURL: "https://hakmate.cenkerozkan.com/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: REQUEST_TIMEOUT,
});

// RAG service axios instance
const ragServiceAxios = axios.create({
  baseURL: "https://hakmate.cenkerozkan.com/api", 
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: REQUEST_TIMEOUT,
});

// Global state management
let globalUserState = {
  userId: null,
  isAuthenticated: false,
  anonymousSession: null,
  lastUpdate: null,
  corsError: false,
  connectionQuality: 'good' // 'good', 'unstable', 'poor'
};

const userStateListeners = new Set();

const notifyUserStateChange = () => {
  userStateListeners.forEach(callback => callback(globalUserState));
};

export const subscribeToUserState = (callback) => {
  userStateListeners.add(callback);
  callback(globalUserState);
  return () => userStateListeners.delete(callback);
};

const updateUserState = (newState) => {
  globalUserState = { ...globalUserState, ...newState, lastUpdate: Date.now() };
  notifyUserStateChange();
};

// Connection quality assessment
const assessConnectionQuality = () => {
  if (consecutiveAxiosFailures >= 3) {
    return 'poor';
  } else if (consecutiveAxiosFailures >= 1) {
    return 'unstable';
  }
  return 'good';
};

// Smart retry with method preference
const smartSendMessage = async (requestBody) => {
  const connectionQuality = assessConnectionQuality();
  
  // CORS sorunu çok ise direkt fetch kullan
  if (connectionQuality === 'poor' || corsIssueDetected) {
    console.log('Using fetch method due to connection issues');
    return await sendWithFetch(requestBody);
  }
  
  // İyi bağlantıda axios'u dene
  try {
    console.log('Trying with Axios (preferred method)...');
    const result = await ragServiceAxios.post("/rag/query", requestBody);
    
    // Başarılı olursa failure counter'ı sıfırla
    consecutiveAxiosFailures = 0;
    corsIssueDetected = false;
    lastSuccessfulMethod = 'axios';
    
    updateUserState({ 
      corsError: false, 
      connectionQuality: 'good' 
    });
    
    console.log('Axios method succeeded');
    return result;
    
  } catch (axiosError) {
    consecutiveAxiosFailures++;
    
    // CORS hatası ise işaretle
    if (axiosError.code === 'ERR_NETWORK' || 
        axiosError.message.includes('CORS')) {
      corsIssueDetected = true;
      console.log('CORS issue detected, falling back to fetch');
    }
    
    updateUserState({ 
      corsError: true, 
      connectionQuality: assessConnectionQuality() 
    });
    
    console.log(`Axios failed (${consecutiveAxiosFailures} consecutive failures), trying fetch...`);
    
    // Fetch ile dene
    try {
      const result = await sendWithFetch(requestBody);
      lastSuccessfulMethod = 'fetch';
      console.log('Fetch method succeeded as fallback');
      return result;
    } catch (fetchError) {
      console.error('Both Axios and Fetch failed:', fetchError.message);
      throw new Error(`Messaging failed: ${fetchError.message}`);
    }
  }
};

// Fetch implementation
const sendWithFetch = async (requestBody) => {
  const token = globalUserState.anonymousSession?.token || 
               sessionStorage.getItem('access_token') || 
               'fallback_token';
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch('https://hakmate.cenkerozkan.com/api/rag/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data };
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Chat service token interceptor (same as before)
chatServiceAxios.interceptors.request.use(async (config) => {
  try {
    const token = sessionStorage.getItem('access_token');
    
    if (token) {
      try {
        const response = await AuthAPI.getMe();
        const userId = response.data?.user?.id || 
                      response.data?.data?.user?.id || 
                      response.data?.id;
        
        if (userId) {
          config.headers.Authorization = `Bearer ${token}`;
          
          if (globalUserState.userId !== userId) {
            updateUserState({
              userId: userId,
              isAuthenticated: true,
              anonymousSession: null
            });
          }
          
          return config;
        }
      } catch (authError) {
        console.warn('Token validation failed, using anonymous session');
      }
    }
    
    // Anonymous session logic
    if (!globalUserState.anonymousSession) {
      try {
        const anonymousResponse = await fetch('http://localhost:3001/api/auth/anonymous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (anonymousResponse.ok) {
          const anonymousData = await anonymousResponse.json();
          const newAnonymousSession = {
            id: anonymousData.id,
            sessionId: anonymousData.sessionId,
            token: `anonymous_${anonymousData.sessionId}`
          };
          
          updateUserState({
            userId: newAnonymousSession.id,
            isAuthenticated: false,
            anonymousSession: newAnonymousSession
          });
        }
      } catch (error) {
        const fallbackSession = {
          id: `guest_${Date.now()}`,
          sessionId: `guest_session_${Date.now()}`,
          token: `guest_user_token`
        };
        
        updateUserState({
          userId: fallbackSession.id,
          isAuthenticated: false,
          anonymousSession: fallbackSession
        });
      }
    }
    
    const currentToken = globalUserState.anonymousSession?.token || 'fallback_token';
    config.headers.Authorization = `Bearer ${currentToken}`;
    
  } catch (error) {
    config.headers.Authorization = `Bearer fallback_token`;
  }
  
  return config;
});

// RAG service token interceptor
ragServiceAxios.interceptors.request.use(async (config) => {
  const currentToken = globalUserState.anonymousSession?.token || 
                      sessionStorage.getItem('access_token') || 
                      'fallback_token';
  
  config.headers.Authorization = `Bearer ${currentToken}`;
  return config;
});

// Response interceptors
[chatServiceAxios, ragServiceAxios].forEach(instance => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
});

// Chat API functions
export const ChatAPI = {
  getCurrentUserId: async () => {
    if (!globalUserState.userId) {
      try {
        const token = sessionStorage.getItem('access_token');
        if (token) {
          const response = await AuthAPI.getMe();
          const userId = response.data?.user?.id || 
                        response.data?.data?.user?.id || 
                        response.data?.id;
          
          if (userId) {
            updateUserState({
              userId: userId,
              isAuthenticated: true,
              anonymousSession: null
            });
            return userId;
          }
        }
        
        await ChatAPI.ensureAnonymousSession();
      } catch (error) {
        console.warn('Failed to initialize user state:', error);
      }
    }
    
    return globalUserState.userId;
  },

  ensureAnonymousSession: async () => {
    if (globalUserState.anonymousSession) {
      return globalUserState.anonymousSession;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        const newAnonymousSession = {
          id: data.id,
          sessionId: data.sessionId,
          isAnonymous: true
        };
        
        updateUserState({
          userId: newAnonymousSession.id,
          isAuthenticated: false,
          anonymousSession: newAnonymousSession
        });
        
        return newAnonymousSession;
      }
      throw new Error('Failed to create anonymous session');
    } catch (error) {
      const fallbackSession = {
        id: `guest_${Date.now()}`,
        sessionId: `guest_session_${Date.now()}`,
        isAnonymous: true
      };
      
      updateUserState({
        userId: fallbackSession.id,
        isAuthenticated: false,
        anonymousSession: fallbackSession
      });
      
      return fallbackSession;
    }
  },

  // Connection quality info
  getConnectionInfo: () => ({
    quality: assessConnectionQuality(),
    corsIssueDetected,
    consecutiveFailures: consecutiveAxiosFailures,
    lastSuccessfulMethod,
    preferredMethod: corsIssueDetected ? 'fetch' : 'axios'
  }),

  resetUserState: () => {
    updateUserState({
      userId: null,
      isAuthenticated: false,
      anonymousSession: null,
      corsError: false,
      connectionQuality: 'good'
    });
    corsIssueDetected = false;
    consecutiveAxiosFailures = 0;
  },

  getUserState: () => ({ ...globalUserState }),

  // Chat service calls
  createChatThread: async ({ chatName, userId = null, anonymousUserId = null }) => {
    const currentUserId = userId || globalUserState.userId || await ChatAPI.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('Failed to determine user ID');
    }

    const requestBody = {
      chat_name: chatName,
      user_id: currentUserId,
      anonymous_user_id: globalUserState.anonymousSession?.sessionId || anonymousUserId,
    };
    
    return await chatServiceAxios.post("/chat_service/create", requestBody);
  },

  deleteChatThread: (chatId) => 
    chatServiceAxios.delete(`/chat_service/delete/${chatId}`),

  getAllChatThreads: async (userId = null) => {
    const currentUserId = userId || globalUserState.userId || await ChatAPI.getCurrentUserId();
    
    if (!currentUserId) {
      return {
        data: {
          success: true,
          message: "No user ID available",
          data: { threads: [] }
        }
      };
    }
    
    return await chatServiceAxios.get(`/chat_service/get_all_chat_threads/${currentUserId}`);
  },

  getChatHistory: (chatId) =>
    chatServiceAxios.get(`/chat_service/get_chat_history/${chatId}`),

  // Optimized message sending
  sendMessage: async ({ chatId, query, userId = null, webSearch = false }) => {
    const currentUserId = userId || globalUserState.userId || await ChatAPI.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User identification required for messaging');
    }

    const requestBody = {
      chat_id: chatId,
      user_id: currentUserId,
      query: query,
      web_search: webSearch
    };
    
    console.log(`Sending message (connection: ${assessConnectionQuality()}):`, {
      user: currentUserId,
      query: query.substring(0, 50) + '...',
      preferredMethod: corsIssueDetected ? 'fetch' : 'axios'
    });
    
    return await smartSendMessage(requestBody);
  }
};

export default chatServiceAxios;