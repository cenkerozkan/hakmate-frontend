import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import axiosInstance from '../api/api';

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  // Modal açıldığında state'i temizle
  React.useEffect(() => {
    if (open) {
      setEmail('');
      setMessage('');
      setError('');
      setIsLoading(false);
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Email validasyonu
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setMessage('');
  
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email: email.trim().toLowerCase()
      });
  
      if (response.data && response.data.success) {
        setMessage(response.data.message || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        setEmail('');
        
        // 3 saniye sonra modal'ı kapat
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Şifre sıfırlama hatası:', err);
      
      if (err.response?.status === 429) {
        setError('Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.');
      } else {
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Şifre sıfırlama işlemi sırasında bir hata oluştu';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Email yazarken hata mesajını temizle
    if (error) {
      setError('');
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
          sx: {
            backgroundImage: 'none',
            px: { xs: 2, sm: 3 },
            width: { xs: '90%', sm: 'auto' },
            m: { xs: 1, sm: 'auto' },
          },
        },
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Şifrenizi sıfırlayın
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          px: { xs: 0, sm: 1 },
        }}
      >
        <DialogContentText sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Hesabınızın e-posta adresini girin, size bir şifre sıfırlama maili gönderelim.
        </DialogContentText>
        
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          placeholder="E-posta adresi"
          type="email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          disabled={isLoading}
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        />

        {/* Hata mesajı */}
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        {/* Başarı mesajı */}
        {message && (
          <Alert severity="success" sx={{ mt: 1 }}>
            {message}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button 
          onClick={handleCloseModal}
          disabled={isLoading}
        >
          Kapat
        </Button>
        <Button 
          variant="contained" 
          type="submit"
          disabled={isLoading || !email}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Gönderiliyor...' : 'Gönder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;