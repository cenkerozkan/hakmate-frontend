import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Paper,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import GuestIcon from "@mui/icons-material/PersonOutline";

import { ChatAPI, subscribeToUserState } from "../../api/apiChat"; 
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedChat, setSelectedChat }) => {
  const [chats, setChats] = useState([]);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // User state management
  const [userState, setUserState] = useState({
    userId: null,
    isAuthenticated: false,
    anonymousSession: null
  });

  // Subscribe to global user state changes
  useEffect(() => {
    const unsubscribe = subscribeToUserState((newUserState) => {
      console.log('Sidebar: User state updated:', newUserState);
      setUserState(newUserState);
    });

    // Initialize if needed
    if (!userState.userId) {
      ChatAPI.getCurrentUserId();
    }

    return unsubscribe;
  }, []);

  // Load chats when user state changes
  useEffect(() => {
    async function fetchChats() {
      if (!userState.userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching chats for user:', userState.userId);
        const response = await ChatAPI.getAllChatThreads(userState.userId);
        console.log('Chats fetch response:', response);
        
        if (response.data.success) {
          setChats(response.data.data.threads || []);
        } else {
          console.error('Failed to load chats:', response.data);
          setError(response.data.message || "Failed to load chats");
        }
      } catch (err) {
        console.error('Error loading chats:', err);
        if (err.response?.status === 403) {
          setError("Authentication required to load chats");
        } else {
          setError(err.message || "Error loading chats");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, [userState.userId, userState.lastUpdate]);

  // Start anonymous session
  const handleAnonymousMode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting anonymous session...');
      const anonymousSession = await ChatAPI.ensureAnonymousSession();
      console.log('Anonymous session started:', anonymousSession);
      
    } catch (error) {
      console.error('Failed to start anonymous session:', error);
      setError('Failed to start anonymous session');
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat
  const handleAddChat = async () => {
    if (!newChatTitle.trim()) {
      setError("Please enter a chat name");
      return;
    }

    if (!userState.userId) {
      setError("Please sign in or start anonymous session");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Creating chat:", {
        chatName: newChatTitle.trim(),
        userId: userState.userId,
        userMode: userState.isAuthenticated ? 'authenticated' : 'anonymous'
      });
      
      const response = await ChatAPI.createChatThread({
        chatName: newChatTitle.trim(),
        userId: userState.userId
      });
      
      console.log("createChatThread response:", response);
      
      if (response.data.success) {
        setChats((prevChats) => [...prevChats, response.data.data.chat]);
        setNewChatTitle("");
        setError(null);
      } else {
        setError(response.data.message || "Failed to create chat");
      }
    } catch (err) {
      console.error("createChatThread error:", err);
      
      if (err.response?.status === 403) {
        setError("Authentication required to create chats");
      } else {
        setError(err.message || "Error creating chat");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete a chat
  const handleDeleteChat = async (chatId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ChatAPI.deleteChatThread(chatId);
      if (response.data.success) {
        setChats((prevChats) =>
          prevChats.filter((chat) => chat.chat_id !== chatId)
        );
        if (selectedChat === chatId) {
          setSelectedChat(null);
        }
        setError(null);
      } else {
        setError(response.data.message || "Failed to delete chat");
      }
    } catch (err) {
      console.error("deleteChatThread error:", err);
      setError(err.message || "Error deleting chat");
    } finally {
      setLoading(false);
    }
  };

  // Determine user mode for display
  const getUserMode = () => {
    if (!userState.userId) return 'initializing';
    if (userState.isAuthenticated) return 'authenticated';
    return 'anonymous';
  };

  // User status component
  const UserStatus = () => {
    const userMode = getUserMode();

    if (userMode === 'initializing') {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">Initializing session...</Typography>
        </Alert>
      );
    }

    if (userMode === 'authenticated') {
      return (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon fontSize="small" />
              <Typography variant="body2">Signed in</Typography>
            </Box>
            <Chip 
              label="Authenticated" 
              size="small" 
              color="success" 
              variant="outlined"
            />
          </Box>
        </Alert>
      );
    }

    if (userMode === 'anonymous') {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GuestIcon fontSize="small" />
              <Typography variant="body2">Anonymous session</Typography>
            </Box>
            <Chip 
              label="Guest" 
              size="small" 
              color="warning" 
              variant="outlined"
            />
          </Box>
        </Alert>
      );
    }

    // Guest mode (no session)
    return (
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Alert severity="warning">
          <Typography variant="body2">No active session</Typography>
        </Alert>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/sign-in')}
          startIcon={<LoginIcon />}
          sx={{ 
            color: '#fff', 
            borderColor: '#fff',
            '&:hover': { borderColor: '#B91C1C', backgroundColor: 'rgba(185, 28, 28, 0.1)' }
          }}
        >
          Sign In
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={handleAnonymousMode}
          disabled={loading}
          startIcon={<GuestIcon />}
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: '#fff' }
          }}
        >
          {loading ? 'Starting...' : 'Start Anonymous Session'}
        </Button>
      </Box>
    );
  };

  const canCreateChat = !!userState.userId;
  const chatPlaceholder = !userState.userId 
    ? "Start session to create chats" 
    : "New chat";

  return (
    <Paper
      sx={{
        width: 280,
        borderRight: "1px solid rgba(255, 255, 255, 0.12)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1A1A1A",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ color: "#fff", mb: 2 }}>
          HakMate Chat
        </Typography>
        
        <UserStatus />

        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={chatPlaceholder}
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddChat();
              }
            }}
            disabled={loading || !canCreateChat}
          />
          <IconButton 
            onClick={handleAddChat} 
            color="primary"
            disabled={loading || !canCreateChat}
          >
            <AddIcon />
          </IconButton>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
            {error}
          </Alert>
        )}

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, display: 'block' }}>
            User ID: {userState.userId || 'None'}
          </Typography>
        )}
      </Box>

      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {loading && chats.length === 0 ? (
          <Typography sx={{ color: "#fff", p: 2 }}>Loading chats...</Typography>
        ) : chats.length === 0 ? (
          <Typography sx={{ color: "#fff", p: 2 }}>
            {!userState.userId ? "Start a session to see chats" : "No chats found"}
          </Typography>
        ) : (
          chats.map((chat) => (
            <ListItem
              key={chat.chat_id}
              selected={selectedChat === chat.chat_id}
              onClick={() => setSelectedChat(chat.chat_id)}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.chat_id);
                  }}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "&.Mui-selected": {
                  backgroundColor: "#B91C1C",
                  "&:hover": {
                    backgroundColor: "#B91C1C",
                  },
                },
              }}
            >
              <ListItemText
                primary={chat.chat_name}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "& .MuiListItemText-primary": {
                    color: "#fff",
                  },
                }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default Sidebar;