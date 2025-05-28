// components/Toast.js
import React from 'react';
import { Snackbar, Alert, AlertTitle, Slide, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Toast({ open, message, severity, onClose, autoHideDuration = 6000 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getSeverityTitle = (severity) => {
    switch (severity) {
      case 'success':
        return 'Başarılı!';
      case 'error':
        return 'Hata!';
      case 'warning':
        return 'Uyarı!';
      case 'info':
        return 'Bilgi';
      default:
        return '';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        mt: 8,
        maxWidth: isMobile ? '90%' : '100%',
        left: isMobile ? '50%' : undefined,
        transform: isMobile ? 'translateX(-50%)' : undefined,
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: '100%',
          '& .MuiAlert-message': {
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          },
        }}
      >
        <AlertTitle sx={{ margin: 0, fontWeight: 600 }}>
          {getSeverityTitle(severity)}
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
}
