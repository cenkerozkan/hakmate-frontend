// src/pages/LawOfficesPage.js
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import LawOffices from '../components/LawOffices/LawOffices';

export default function LawOfficesPage() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Fixed Navbar */}
        <AppAppBar />
        
        {/* Main Content with proper spacing for fixed navbar */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 10, sm: 12 }, // Fixed navbar için üst boşluk
            bgcolor: 'background.default',
          }}
        >
          <LawOffices />
        </Box>
      </Box>
    </AppTheme>
  );
}