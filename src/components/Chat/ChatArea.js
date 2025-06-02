import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  AppBar,
  Toolbar,
  Switch,
  InputAdornment,
  Avatar,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import ErrorIcon from "@mui/icons-material/Error";
import { ChatAPI, subscribeToUserState } from "../../api/apiChat";
import ReactMarkdown from "react-markdown";

const BURGUNDY = "#8B1818";

const FAQS = [
  "Hukuki bir sorunla karşılaştığımda ilk ne yapmalıyım?",
  "Avukat tutmam gereken durumlar nelerdir?",
  "Hukuki belgelerimi nasıl saklamalıyım?",
  "İş hukuku konularında ne bilmem gerekir?",
  "Tüketici haklarım nelerdir?",
];

const Message = ({ type, content }) => {
  const isQuestion = type === "question";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "800px",
        mb: 2,
        mx: "auto",
        px: 4,
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        justifyContent: isQuestion ? "flex-end" : "flex-start",
      }}
    >
      {!isQuestion && (
        <Avatar
          sx={{
            bgcolor: BURGUNDY,
            width: 32,
            height: 32,
          }}
        >
          <AccountCircleIcon fontSize="small" />
        </Avatar>
      )}
      <Paper
        sx={{
          p: 2,
          flex: "0 1 auto",
          maxWidth: "70%",
          backgroundColor: isQuestion ? "background.paper" : BURGUNDY,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Typography color="#fff">
            {!isQuestion && (
              <Typography
                component="span"
                variant="subtitle2"
                sx={{ display: "block", mb: 1, color: "rgba(255,255,255,0.7)" }}
              >
                HakMate
              </Typography>
            )}
            {isQuestion && (
              <Typography
                component="span"
                variant="subtitle2"
                sx={{ display: "block", mb: 1, color: "rgba(255,255,255,0.7)" }}
              >
                Siz
              </Typography>
            )}
            {type === "answer" ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              content
            )}
          </Typography>
        </Box>
        {!isQuestion && (
          <Box
            sx={{ mt: 1, display: "flex", gap: 1, justifyContent: "flex-end" }}
          >
            <IconButton size="small" sx={{ color: "#fff" }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Paper>
      {isQuestion && (
        <Avatar
          sx={{
            bgcolor: "#f5f5f5",
            width: 32,
            height: 32,
          }}
        >
          <AccountCircleIcon fontSize="small" sx={{ color: "#666666" }} />
        </Avatar>
      )}
    </Box>
  );
};

const FAQSection = ({ onSelect, disabled }) => (
  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 0,
    }}
  >
    <Typography variant="h6" sx={{ color: "#fff", mb: 4 }}>
      Sık Sorulan Sorular
    </Typography>
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {FAQS.map((faq, idx) => (
        <Button
          key={idx}
          variant="contained"
          onClick={() => onSelect(faq)}
          disabled={disabled}
          sx={{
            background: disabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
            color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
            borderRadius: 5,
            textTransform: "none",
            fontWeight: 400,
            fontSize: 16,
            py: 1.2,
            "&:hover": {
              background: disabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.25)",
            },
          }}
        >
          {faq}
        </Button>
      ))}
    </Box>
  </Box>
);

const ChatArea = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  
  // User state management
  const [userState, setUserState] = useState({
    userId: null,
    isAuthenticated: false,
    anonymousSession: null
  });

  // Subscribe to global user state changes
  useEffect(() => {
    const unsubscribe = subscribeToUserState((newUserState) => {
      setUserState(newUserState);
    });

    // Initialize user state
    ChatAPI.getCurrentUserId();

    return unsubscribe;
  }, []);

  // Load chat history when a chat is selected
  useEffect(() => {
    async function loadChatHistory() {
      if (!selectedChat) {
        setMessages([]);
        return;
      }

      setLoading(true);
      setError(null);
      setNetworkError(false);
      
      try {
        const response = await ChatAPI.getChatHistory(selectedChat);
        
        if (response.data.success) {
          setMessages(response.data.data.history || []);
        } else {
          setError(response.data.message || "Failed to load chat history");
        }
      } catch (err) {
        if (err.code === 'ERR_NETWORK') {
          setNetworkError(true);
          setError("Network error: Chat service is unavailable");
        } else {
          setError(err.message || "Error loading chat history");
        }
      } finally {
        setLoading(false);
      }
    }

    loadChatHistory();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      return;
    }

    if (!userState.userId) {
      setError("User identification required. Please wait for session initialization.");
      return;
    }

    const messageToSend = newMessage.trim();
    setNewMessage("");
    setError(null);
    setNetworkError(false);

    // Optimistically add the message to the UI
    const userMessage = { 
      role: "user", 
      content: messageToSend,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await ChatAPI.sendMessage({
        chatId: selectedChat,
        query: messageToSend,
        userId: userState.userId,
        webSearch: webSearch
      });
      
      if (response.data.success && response.data.data && response.data.data.response) {
        const assistantMessage = {
          role: "assistant",
          content: response.data.data.response,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(response.data.message || "Failed to send message");
        setMessages(prev => prev.slice(0, -1));
      }
    } catch (err) {
      if (err.message.includes('Network error')) {
        setNetworkError(true);
        setError("Network error: Chat service is unavailable. Please try again later.");
      } else if (err.message.includes('Authentication required')) {
        setError("Authentication required for messaging");
      } else {
        setError(err.message || "Error sending message");
      }
      
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleFAQSelect = async (faq) => {
    if (!selectedChat) {
      setError("Please select a chat first");
      return;
    }

    if (!userState.userId) {
      setError("User identification required. Please wait for session initialization.");
      return;
    }

    // Add user message to UI
    const userMessage = { 
      role: "user", 
      content: faq,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setError(null);
    setNetworkError(false);

    // Send the FAQ question as a message
    try {
      const response = await ChatAPI.sendMessage({
        chatId: selectedChat,
        query: faq,
        userId: userState.userId,
        webSearch: webSearch
      });
      
      if (response.data.success && response.data.data && response.data.data.response) {
        const assistantMessage = {
          role: "assistant",
          content: response.data.data.response,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(response.data.message || "Failed to process FAQ");
        setMessages(prev => prev.slice(0, -1));
      }
    } catch (err) {
      if (err.message.includes('Network error')) {
        setNetworkError(true);
        setError("Network error: Chat service is unavailable");
      } else {
        setError(err.message || "Error processing FAQ");
      }
      
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const ErrorDisplay = () => {
    if (!error) return null;

    return (
      <Alert 
        severity={networkError ? "warning" : "error"} 
        sx={{ mx: 2, mb: 1 }}
        icon={networkError ? <ErrorIcon /> : undefined}
        action={
          networkError && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => {
                setError(null);
                setNetworkError(false);
              }}
            >
              Dismiss
            </Button>
          )
        }
      >
        {error}
      </Alert>
    );
  };

  // User status indicator - sadece authenticated/anonymous göster
  const UserStatusIndicator = () => {
    if (!userState.userId) {
      return null; // Initializing durumunda hiçbir şey gösterme
    }

    if (userState.isAuthenticated) {
      return (
        <Chip 
          label="Authenticated" 
          size="small" 
          color="success" 
          variant="outlined"
          sx={{ color: '#fff', borderColor: '#fff' }}
        />
      );
    }

    // Anonymous durumunda da hiçbir şey gösterme
    return null;
  };

  const canInteract = !!userState.userId && !networkError;

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: BURGUNDY,
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <UserStatusIndicator />
          <Typography variant="h6" component="div">
            HakMate
          </Typography>
          <IconButton sx={{ color: "#fff" }}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <ErrorDisplay />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : messages.length === 0 ? (
        <FAQSection onSelect={handleFAQSelect} disabled={!canInteract} />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            py: 3,
          }}
        >
          {messages.map((message, index) => (
            <Message 
              key={index} 
              type={message.role === "user" ? "question" : "answer"} 
              content={message.content} 
            />
          ))}
        </Box>
      )}

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <IconButton color="primary">
          <UploadFileIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder={
            !userState.userId 
              ? "Oturum başlatılıyor..."
              : !selectedChat 
                ? "Önce bir chat seçin" 
                : "Mesajınızı yazın..."
          }
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={!canInteract || !selectedChat}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  color="primary"
                  edge="end"
                  disabled={!canInteract || !selectedChat}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Web Arama
          </Typography>
          <Switch
            checked={webSearch}
            onChange={(e) => setWebSearch(e.target.checked)}
            disabled={!canInteract}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: BURGUNDY,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: BURGUNDY,
              },
            }}
          />
        </Box>
        <IconButton>
          <HelpIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatArea;