import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import SignInPage from "./pages/SignInSide";
import SignUpPage from "./pages/SignUp";
import MainPage from "./pages/MainPage";
import LawOfficesPage from "./pages/LawOfficesPage";
import ContactPage from "./pages/ContactPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

// Chat components
import Sidebar from "../src/components/Chat/Sidebar";
import ChatArea from "../src/components/Chat/ChatArea";

// Chat için dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#B91C1C",
    },
    background: {
      default: "#1A1A1A",
      paper: "#1A1A1A",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#fff",
            color: "#000",
            "&:hover": {
              backgroundColor: "#fff",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        },
      },
    },
  },
});

// Chat sayfası için ayrı component - YENİ VERSİYON
const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Sidebar state management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Hamburger Menu Button - Sidebar kapalıyken göster */}
        {!sidebarOpen && (
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1000,
              backgroundColor: "#8B1818",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#722020",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Sidebar - Yeni props'larla */}
        <Sidebar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          isCollapsed={sidebarCollapsed}
          onCollapse={handleSidebarCollapse}
        />

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            // Hamburger button için space bırak
            marginLeft: !sidebarOpen ? "60px" : 0,
          }}
        >
          <ChatArea selectedChat={selectedChat} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/law-offices" element={<LawOfficesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Chat route - güncellenmiş sidebar ile */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
