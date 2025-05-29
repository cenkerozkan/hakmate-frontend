import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthAPI } from '../api/api';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  maxWidth: '450px',
  boxShadow: theme.shadows[8],
}));

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // URL'den token parametrelerini al
  React.useEffect(() => {
    const hash = location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const tokenType = params.get('type');

    // Recovery token kontrolü
    if (tokenType !== 'recovery' || !accessToken) {
      navigate('/sign-in');
      return;
    }

    // Token'ı sessionStorage'a kaydet (geçici olarak)
    sessionStorage.setItem('access_token', accessToken);
  }, [location, navigate]);

  const validatePassword = (pwd) => {
    if (!pwd || pwd.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır.';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pwd)) {
      return 'Şifre en az bir harf ve bir rakam içermelidir.';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    
    // Confirm password kontrolü
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (password !== newConfirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Final validasyon
    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await AuthAPI.updatePassword({
        password: password
      });

      if (response.data && response.data.success) {
        setSuccess('Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...');
        
        // Token'ı temizle
        sessionStorage.removeItem('access_token');
        
        // 2 saniye sonra giriş sayfasına yönlendir
        setTimeout(() => {
          navigate('/sign-in');
        }, 2000);
      }
    } catch (err) {
      console.error('Şifre güncelleme hatası:', err);
      const errorMessage = err.response?.data?.message || 
                          'Şifre güncelleme sırasında bir hata oluştu';
      setError(errorMessage);
      
      // Hata durumunda token'ı temizle ve giriş sayfasına yönlendir
      sessionStorage.removeItem('access_token');
      setTimeout(() => {
        navigate('/sign-in');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        px: 2,
        bgcolor: 'background.default'
      }}
    >
      <StyledCard>
        <Typography variant="h4" component="h1" textAlign="center" mb={1}>
          Şifrenizi Yenileyin
        </Typography>
        
        <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
          Lütfen yeni şifrenizi belirleyin
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="password">Yeni Şifre</FormLabel>
            <TextField
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError || 'En az 6 karakter, bir harf ve bir rakam içermelidir'}
              required
              fullWidth
              disabled={isLoading}
              placeholder="••••••"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Şifre Tekrarı</FormLabel>
            <TextField
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              required
              fullWidth
              disabled={isLoading}
              placeholder="••••••"
            />
          </FormControl>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success">
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading || !!passwordError || !!confirmPasswordError || !password || !confirmPassword}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </Button>

          <Button
            variant="text"
            onClick={() => navigate('/sign-in')}
            disabled={isLoading}
          >
            Giriş Sayfasına Dön
          </Button>
        </Box>
      </StyledCard>
    </Box>
  );
}