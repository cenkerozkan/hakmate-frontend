import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInSide';
import SignUpPage from './pages/SignUp';
import MainPage from './pages/MainPage';
import LawOfficesPage from './pages/LawOfficesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/law-offices" element={<LawOfficesPage />} />
      </Routes>
    </Router>
  );
}

export default App;