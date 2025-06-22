import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Switch,
  InputAdornment,
  Avatar,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Fade,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import ErrorIcon from "@mui/icons-material/Error";
import { ChatAPI, subscribeToUserState } from "../../api/apiChat";
import ReactMarkdown from "react-markdown";
import PDFUpload from "./PDFUpload";

const BURGUNDY = "#8B1818";

const FAQS = [
  "Hukuki bir sorunla karşılaştığımda ilk ne yapmalıyım?",
  "Avukat tutmam gereken durumlar nelerdir?",
  "Hukuki belgelerimi nasıl saklamalıyım?",
  "İş hukuku konularında ne bilmem gerekir?",
  "Tüketici haklarım nelerdir?",
];

// Typing Indicator Component
const TypingIndicator = ({ isMobile }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: isMobile ? "100%" : "800px",
      mb: 2,
      mx: "auto",
      px: isMobile ? 2 : 4,
      display: "flex",
      alignItems: "flex-start",
      gap: isMobile ? 1 : 2,
      justifyContent: "flex-start",
    }}
  >
    <Avatar
      sx={{
        bgcolor: BURGUNDY,
        width: isMobile ? 28 : 32,
        height: isMobile ? 28 : 32,
      }}
    >
      <AccountCircleIcon fontSize={isMobile ? "small" : "medium"} />
    </Avatar>
    <Paper
      sx={{
        p: isMobile ? 1.5 : 2,
        flex: "0 1 auto",
        maxWidth: isMobile ? "85%" : "70%",
        backgroundColor: BURGUNDY,
        borderRadius: 2,
      }}
    >
      <Typography
        component="span"
        variant="subtitle2"
        sx={{
          display: "block",
          mb: 1,
          color: "rgba(255,255,255,0.7)",
          fontSize: isMobile ? "0.75rem" : "0.875rem",
        }}
      >
        HakMate
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: isMobile ? "13px" : "14px",
          }}
        >
          Cevap hazırlanıyor
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: isMobile ? 4 : 6,
                height: isMobile ? 4 : 6,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.7)",
                animation: "typing 1.4s infinite",
                animationDelay: `${index * 0.2}s`,
                "@keyframes typing": {
                  "0%, 60%, 100%": {
                    transform: "translateY(0)",
                    opacity: 0.4,
                  },
                  "30%": {
                    transform: `translateY(-${isMobile ? 6 : 10}px)`,
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  </Box>
);

// Loading Skeleton for initial chat load
const MessageSkeleton = ({ isMobile }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: isMobile ? "100%" : "800px",
      mb: 2,
      mx: "auto",
      px: isMobile ? 2 : 4,
      display: "flex",
      alignItems: "flex-start",
      gap: isMobile ? 1 : 2,
    }}
  >
    <Skeleton
      variant="circular"
      width={isMobile ? 28 : 32}
      height={isMobile ? 28 : 32}
    />
    <Box sx={{ flex: 1, maxWidth: isMobile ? "85%" : "70%" }}>
      <Skeleton
        variant="rectangular"
        height={isMobile ? 50 : 60}
        sx={{ borderRadius: 2 }}
      />
    </Box>
  </Box>
);

const Message = ({ type, content, isNew = false, isMobile }) => {
  const isQuestion = type === "question";

  return (
    <Fade in={true} timeout={isNew ? 800 : 0}>
      <Box
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "800px",
          mb: isMobile ? 1.5 : 2,
          mx: "auto",
          px: isMobile ? 2 : 4,
          display: "flex",
          alignItems: "flex-start",
          gap: isMobile ? 1 : 2,
          justifyContent: isQuestion ? "flex-end" : "flex-start",
          transform: isNew ? "translateY(-10px)" : "none",
          transition: "transform 0.3s ease-out",
        }}
      >
        {!isQuestion && (
          <Avatar
            sx={{
              bgcolor: BURGUNDY,
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <AccountCircleIcon fontSize={isMobile ? "small" : "medium"} />
          </Avatar>
        )}
        <Paper
          sx={{
            p: isMobile ? 1.5 : 2,
            flex: "0 1 auto",
            maxWidth: isMobile ? "85%" : "70%",
            backgroundColor: isQuestion ? "background.paper" : BURGUNDY,
            borderRadius: 2,
            ...(isNew && {
              boxShadow: "0 4px 20px rgba(139, 24, 24, 0.3)",
              animation: "messageGlow 2s ease-out",
              "@keyframes messageGlow": {
                "0%": { boxShadow: "0 4px 20px rgba(139, 24, 24, 0.5)" },
                "100%": { boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" },
              },
            }),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Typography
              color="#fff"
              sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
            >
              {!isQuestion && (
                <Typography
                  component="span"
                  variant="subtitle2"
                  sx={{
                    display: "block",
                    mb: 1,
                    color: "rgba(255,255,255,0.7)",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  }}
                >
                  HakMate
                </Typography>
              )}
              {isQuestion && (
                <Typography
                  component="span"
                  variant="subtitle2"
                  sx={{
                    display: "block",
                    mb: 1,
                    color: "rgba(255,255,255,0.7)",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  }}
                >
                  Siz
                </Typography>
              )}
              {type === "answer" ? (
                <Box
                  sx={{
                    "& p": {
                      fontSize: isMobile ? "0.875rem" : "1rem",
                      margin: 0,
                    },
                    "& ul, & ol": { fontSize: isMobile ? "0.875rem" : "1rem" },
                    "& li": { marginBottom: "4px" },
                  }}
                >
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Box>
              ) : (
                content
              )}
            </Typography>
          </Box>
        </Paper>
        {isQuestion && (
          <Avatar
            sx={{
              bgcolor: "#f5f5f5",
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <AccountCircleIcon
              fontSize={isMobile ? "small" : "medium"}
              sx={{ color: "#666666" }}
            />
          </Avatar>
        )}
      </Box>
    </Fade>
  );
};

const FAQSection = ({ onSelect, disabled, isMobile }) => (
  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 0,
      px: isMobile ? 2 : 0,
    }}
  >
    <Typography
      variant={isMobile ? "h6" : "h6"}
      sx={{
        color: "#fff",
        mb: isMobile ? 3 : 4,
        fontSize: isMobile ? "1.1rem" : "1.25rem",
        textAlign: "center",
      }}
    >
      Sık Sorulan Sorular
    </Typography>
    <Box
      sx={{
        width: "100%",
        maxWidth: isMobile ? "100%" : 500,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 1.5 : 2,
      }}
    >
      {FAQS.map((faq, idx) => (
        <Button
          key={idx}
          variant="contained"
          onClick={() => onSelect(faq)}
          disabled={disabled}
          sx={{
            background: disabled
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.15)",
            color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
            borderRadius: isMobile ? 3 : 5,
            textTransform: "none",
            fontWeight: 400,
            fontSize: isMobile ? 14 : 16,
            py: isMobile ? 1 : 1.2,
            px: isMobile ? 1.5 : 2,
            lineHeight: isMobile ? 1.3 : 1.4,
            transition: "all 0.3s ease",
            "&:hover": {
              background: disabled
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.25)",
              transform: disabled ? "none" : "translateY(-2px)",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Scroll referansı
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // User state management
  const [userState, setUserState] = useState({
    userId: null,
    isAuthenticated: false,
    anonymousSession: null,
  });

  // Auto-scroll function
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  };

  // Subscribe to global user state changes
  useEffect(() => {
    const unsubscribe = subscribeToUserState((newUserState) => {
      setUserState(newUserState);
    });

    // Initialize user state
    ChatAPI.getCurrentUserId();

    return unsubscribe;
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    // Kısa bir delay ile scroll işlemini yap (DOM render için)
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, isTyping]);

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
          // İlk yükleme sonrası hemen en alta scroll
          setTimeout(() => scrollToBottom(false), 200);
        } else {
          setError(response.data.message || "Failed to load chat history");
        }
      } catch (err) {
        if (err.code === "ERR_NETWORK") {
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
    if (!newMessage.trim() || !selectedChat || sendingMessage) {
      return;
    }

    if (!userState.userId) {
      setError(
        "User identification required. Please wait for session initialization."
      );
      return;
    }

    const messageToSend = newMessage.trim();
    setNewMessage("");
    setError(null);
    setNetworkError(false);
    setSendingMessage(true);

    // Optimistically add the user message to the UI
    const userMessage = {
      role: "user",
      content: messageToSend,
      created_at: new Date().toISOString(),
      isNew: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await ChatAPI.sendMessage({
        chatId: selectedChat,
        query: messageToSend,
        userId: userState.userId,
        webSearch: webSearch,
      });

      // Hide typing indicator
      setIsTyping(false);

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.response
      ) {
        const assistantMessage = {
          role: "assistant",
          content: response.data.data.response,
          created_at: new Date().toISOString(),
          isNew: true,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setError(response.data.message || "Failed to send message");
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (err) {
      setIsTyping(false);

      if (err.message.includes("Network error")) {
        setNetworkError(true);
        setError(
          "Network error: Chat service is unavailable. Please try again later."
        );
      } else if (err.message.includes("Authentication required")) {
        setError("Authentication required for messaging");
      } else {
        setError(err.message || "Error sending message");
      }

      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFAQSelect = async (faq) => {
    if (!selectedChat || sendingMessage) {
      setError("Please select a chat first");
      return;
    }

    if (!userState.userId) {
      setError(
        "User identification required. Please wait for session initialization."
      );
      return;
    }

    setSendingMessage(true);

    // Add user message to UI
    const userMessage = {
      role: "user",
      content: faq,
      created_at: new Date().toISOString(),
      isNew: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    setError(null);
    setNetworkError(false);
    setIsTyping(true);

    // Send the FAQ question as a message
    try {
      const response = await ChatAPI.sendMessage({
        chatId: selectedChat,
        query: faq,
        userId: userState.userId,
        webSearch: webSearch,
      });

      setIsTyping(false);

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.response
      ) {
        const assistantMessage = {
          role: "assistant",
          content: response.data.data.response,
          created_at: new Date().toISOString(),
          isNew: true,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setError(response.data.message || "Failed to process FAQ");
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (err) {
      setIsTyping(false);

      if (err.message.includes("Network error")) {
        setNetworkError(true);
        setError("Network error: Chat service is unavailable");
      } else {
        setError(err.message || "Error processing FAQ");
      }

      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSendingMessage(false);
    }
  };

  const ErrorDisplay = () => {
    if (!error) return null;

    return (
      <Alert
        severity={networkError ? "warning" : "error"}
        sx={{
          mx: isMobile ? 1 : 2,
          mb: 1,
          fontSize: isMobile ? "0.875rem" : "1rem",
        }}
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

  // User status indicator
  const UserStatusIndicator = () => {
    if (!userState.userId) {
      return null;
    }

    if (userState.isAuthenticated) {
      return (
        <Chip
          label="Authenticated"
          size="small"
          color="success"
          variant="outlined"
          sx={{
            color: "#fff",
            borderColor: "#fff",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        />
      );
    }

    return null;
  };

  const canInteract = !!userState.userId && !networkError && !sendingMessage;

  return (
    <Box
      sx={{
        height: "100vh", // Ana container full height
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Ana container overflow'u gizle
      }}
    >
      <ErrorDisplay />

      {loading ? (
        <Box sx={{ flexGrow: 1, py: isMobile ? 2 : 3, overflow: "auto" }}>
          {[1, 2, 3].map((index) => (
            <MessageSkeleton key={index} isMobile={isMobile} />
          ))}
        </Box>
      ) : messages.length === 0 && !isTyping ? (
        <FAQSection
          onSelect={handleFAQSelect}
          disabled={!canInteract}
          isMobile={isMobile}
        />
      ) : (
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto", // Sadece Y ekseninde scroll
            overflowX: "hidden",
            py: isMobile ? 1 : 2,
            // Scroll davranışını iyileştir
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            // Alt padding ekle ki son mesaj görünebilsin
            paddingBottom: isMobile ? 2 : 3,
          }}
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              type={message.role === "user" ? "question" : "answer"}
              content={message.content}
              isNew={message.isNew}
              isMobile={isMobile}
            />
          ))}
          {isTyping && <TypingIndicator isMobile={isMobile} />}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </Box>
      )}

      {/* Input area - flex-shrink: 0 ile sabit tut */}
      <Box
        sx={{
          flexShrink: 0, // Input alanını sabit boyutta tut
          p: isMobile ? 1.5 : 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          gap: isMobile ? 0.5 : 1,
          alignItems: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
          backgroundColor: "background.default", // Arka plan rengini netleştir
        }}
      >
        {!isMobile && (
          <PDFUpload
            chatId={selectedChat}
            disabled={!canInteract || !selectedChat}
            onUploadSuccess={(result) => {
              console.log("PDF uploaded successfully:", result);
              // Optionally refresh chat history or show success message
            }}
            onUploadError={(error) => {
              console.error("PDF upload failed:", error);
              // Error is already handled by the PDFUpload component
            }}
          />
        )}

        <TextField
          fullWidth
          placeholder={
            !userState.userId
              ? "Oturum başlatılıyor..."
              : !selectedChat
              ? "Önce bir chat seçin"
              : sendingMessage
              ? "Mesaj gönderiliyor..."
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
          multiline={isMobile}
          maxRows={isMobile ? 3 : 1}
          sx={{
            "& .MuiInputBase-input": {
              fontSize: isMobile ? "16px" : "14px", // 16px mobilde zoom'u önler
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  color="primary"
                  edge="end"
                  disabled={!canInteract || !selectedChat || !newMessage.trim()}
                  size={isMobile ? "small" : "medium"}
                >
                  {sendingMessage ? (
                    <CircularProgress size={isMobile ? 16 : 20} />
                  ) : (
                    <SendIcon fontSize={isMobile ? "small" : "medium"} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Web arama toggle - mobilde alt satıra al */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ...(isMobile && {
              width: "100%",
              justifyContent: "center",
              mt: 1,
            }),
          }}
        >
          {isMobile && (
            <PDFUpload
              chatId={selectedChat}
              disabled={!canInteract || !selectedChat}
              onUploadSuccess={(result) => {
                console.log("PDF uploaded successfully:", result);
                // Optionally refresh chat history or show success message
              }}
              onUploadError={(error) => {
                console.error("PDF upload failed:", error);
                // Error is already handled by the PDFUpload component
              }}
            />
          )}
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Web Arama
          </Typography>
          <Switch
            checked={webSearch}
            onChange={(e) => setWebSearch(e.target.checked)}
            disabled={!canInteract}
            size={isMobile ? "small" : "medium"}
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

        {!isMobile && (
          <IconButton>
            <HelpIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ChatArea;
