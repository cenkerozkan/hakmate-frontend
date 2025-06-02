import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import SignInPage from './pages/SignInSide';
import SignUpPage from './pages/SignUp';
import MainPage from './pages/MainPage';
import LawOfficesPage from './pages/LawOfficesPage';
import ContactPage from './pages/ContactPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Chat components
import Sidebar from '../src/components/Chat/Sidebar';
import ChatArea from '../src/components/Chat/ChatArea';

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

// Chat sayfası için ayrı component
const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
        <ChatArea selectedChat={selectedChat} />
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
        
        {/* Chat route - ayrı theme ile */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;