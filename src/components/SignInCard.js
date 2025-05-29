import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { SitemarkIcon } from './CustomIcons';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../api/api';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sadece sayfa ilk yüklendiğinde bir kez kontrol et
  React.useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      AuthAPI.getMe()
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          // Token geçersizse temizle
          sessionStorage.removeItem('access_token');
        });
    }
  }, []); // Boş dependency array - sadece mount'ta çalışır

  // Şifre sıfırlama modalını açarken
  const handleClickOpen = () => {
   
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email');
      const password = formData.get('password');
  
      const response = await AuthAPI.signIn({
        email,
        password
      });
  
      if (response.data && response.data.success && response.data.data) {
        const { session } = response.data.data;
        
        if (session && session.access_token) {
          sessionStorage.setItem('access_token', session.access_token);
          showSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          showError('Giriş başarısız: Oturum bilgileri alınamadı');
        }
      } else {
        showError('Giriş başarısız: Geçersiz yanıt formatı');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Giriş işlemi sırasında bir hata oluştu';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Şifre en az 6 karakter uzunluğunda olmalıdır.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '100vh',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Card variant="outlined">
          <Link href="/">
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <SitemarkIcon style={{ pointerEvents: 'auto', cursor: 'pointer' }} />
            </Box>
          </Link>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Giriş Yap
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">E-posta</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="sizin@epostadresiniz.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                disabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Şifre</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Şifrenizi mi unuttunuz?
                </Link>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                disabled={isLoading}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Beni hatırla"
              disabled={isLoading}
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Hesabınız yok mu?{' '}
              <span>
                <Link
                  href="/sign-up/"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Kayıt Ol
                </Link>
              </span>
            </Typography>
          </Box>
        </Card>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={hideToast}
      />
    </>
  );
}