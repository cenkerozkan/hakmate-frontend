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
  Divider,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import GuestIcon from "@mui/icons-material/PersonOutline";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { ChatAPI, subscribeToUserState } from "../../api/apiChat";
import { useNavigate } from "react-router-dom";

const SIDEBAR_WIDTH = 280;
const COLLAPSED_WIDTH = 60;

const Sidebar = ({
  selectedChat,
  setSelectedChat,
  isOpen = true,
  onToggle,
  isCollapsed = false,
  onCollapse,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [chats, setChats] = useState([]);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // User state management
  const [userState, setUserState] = useState({
    userId: null,
    isAuthenticated: false,
    anonymousSession: null,
  });

  // Subscribe to global user state changes
  useEffect(() => {
    const unsubscribe = subscribeToUserState((newUserState) => {
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
        const response = await ChatAPI.getAllChatThreads(userState.userId);

        if (response.data.success) {
          setChats(response.data.data.threads || []);
        } else {
          setError(response.data.message || "Failed to load chats");
        }
      } catch (err) {
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

      await ChatAPI.ensureAnonymousSession();
    } catch (error) {
      setError("Failed to start anonymous session");
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
      const response = await ChatAPI.createChatThread({
        chatName: newChatTitle.trim(),
        userId: userState.userId,
      });

      if (response.data.success) {
        setChats((prevChats) => [...prevChats, response.data.data.chat]);
        setNewChatTitle("");
        setError(null);
      } else {
        setError(response.data.message || "Failed to create chat");
      }
    } catch (err) {
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
      setError(err.message || "Error deleting chat");
    } finally {
      setLoading(false);
    }
  };

  // Determine user mode for display
  const getUserMode = () => {
    if (!userState.userId) return "initializing";
    if (userState.isAuthenticated) return "authenticated";
    return "anonymous";
  };

  // User status component
  const UserStatus = () => {
    const userMode = getUserMode();

    // Collapsed mode için sadece icon göster
    if (isCollapsed && !isMobile) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {userMode === "authenticated" ? (
            <PersonIcon sx={{ color: "#4caf50" }} />
          ) : userMode === "anonymous" ? (
            <GuestIcon sx={{ color: "#ff9800" }} />
          ) : (
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#666",
                borderRadius: "50%",
              }}
            />
          )}
        </Box>
      );
    }

    if (userMode === "initializing") {
      return (
        <Alert
          severity="info"
          sx={{ mb: 2, fontSize: isMobile ? "0.75rem" : "0.875rem" }}
        >
          <Typography variant="body2">Initializing session...</Typography>
        </Alert>
      );
    }

    if (userMode === "authenticated") {
      return (
        <Alert
          severity="success"
          sx={{ mb: 2, fontSize: isMobile ? "0.75rem" : "0.875rem" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

    if (userMode === "anonymous") {
      return (
        <Alert
          severity="info"
          sx={{ mb: 2, fontSize: isMobile ? "0.75rem" : "0.875rem" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
      <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Alert
          severity="warning"
          sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
        >
          <Typography variant="body2">No active session</Typography>
        </Alert>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/sign-in")}
          startIcon={<LoginIcon />}
          sx={{
            color: "#fff",
            borderColor: "#fff",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            "&:hover": {
              borderColor: "#B91C1C",
              backgroundColor: "rgba(185, 28, 28, 0.1)",
            },
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
            color: "rgba(255,255,255,0.7)",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            "&:hover": { color: "#fff" },
          }}
        >
          {loading ? "Starting..." : "Start Anonymous Session"}
        </Button>
      </Box>
    );
  };

  const canCreateChat = !!userState.userId;
  const chatPlaceholder = !userState.userId
    ? "Start session to create chats"
    : "New chat";

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1A1A1A",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: isCollapsed && !isMobile ? 1 : 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: isCollapsed && !isMobile ? 0 : 2,
          }}
        >
          {(!isCollapsed || isMobile) && (
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: "#fff",
                fontSize: isMobile ? "1.1rem" : "1.25rem",
              }}
            >
              HakMate Chat
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 0.5 }}>
            {(!isCollapsed || isMobile) && (
              <IconButton
                onClick={() => navigate("/")}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                title="Ana Sayfaya Dön"
              >
                <HomeIcon fontSize={isMobile ? "medium" : "small"} />
              </IconButton>
            )}

            {/* Collapse/Expand button for desktop */}
            {!isMobile && onCollapse && (
              <IconButton
                onClick={onCollapse}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                title={isCollapsed ? "Sidebar'ı Genişlet" : "Sidebar'ı Daralt"}
              >
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            )}

            {/* Close button for mobile */}
            {isMobile && onToggle && (
              <IconButton
                onClick={onToggle}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <UserStatus />

        {(!isCollapsed || isMobile) && (
          <>
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
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: isMobile ? "14px" : "13px",
                  },
                }}
              />
              <IconButton
                onClick={handleAddChat}
                color="primary"
                disabled={loading || !canCreateChat}
              >
                <AddIcon fontSize={isMobile ? "medium" : "small"} />
              </IconButton>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 1, fontSize: "0.75rem" }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Chat List */}
      <List sx={{ flexGrow: 1, overflow: "auto", py: 0 }}>
        {loading && chats.length === 0 ? (
          <ListItem>
            <Typography sx={{ color: "#fff", fontSize: "0.875rem" }}>
              {isCollapsed && !isMobile ? "..." : "Loading chats..."}
            </Typography>
          </ListItem>
        ) : chats.length === 0 ? (
          <ListItem>
            <Typography sx={{ color: "#fff", fontSize: "0.875rem" }}>
              {isCollapsed && !isMobile
                ? "..."
                : !userState.userId
                ? "Start a session to see chats"
                : "No chats found"}
            </Typography>
          </ListItem>
        ) : (
          chats.map((chat) => (
            <ListItem
              key={chat.chat_id}
              selected={selectedChat === chat.chat_id}
              onClick={() => {
                setSelectedChat(chat.chat_id);
                if (isMobile && onToggle) onToggle(); // Mobilde chat seçince sidebar'ı kapat
              }}
              secondaryAction={
                (!isCollapsed || isMobile) && (
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.chat_id);
                    }}
                    disabled={loading}
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )
              }
              sx={{
                cursor: "pointer",
                px: isCollapsed && !isMobile ? 1 : 2,
                py: 1,
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
                primary={
                  isCollapsed && !isMobile
                    ? chat.chat_name.substring(0, 2).toUpperCase()
                    : chat.chat_name
                }
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "& .MuiListItemText-primary": {
                    color: "#fff",
                    fontSize: isCollapsed && !isMobile ? "0.75rem" : "0.875rem",
                    textAlign: isCollapsed && !isMobile ? "center" : "left",
                  },
                }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  // Mobile için Drawer kullan
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            backgroundColor: "#1A1A1A",
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop için Paper - açık/kapalı ve daraltılmış modları destekle
  if (!isOpen) return null;

  return (
    <Paper
      sx={{
        width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        borderRight: "1px solid rgba(255, 255, 255, 0.12)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1A1A1A",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: "hidden",
      }}
    >
      {sidebarContent}
    </Paper>
  );
};

export default Sidebar;
