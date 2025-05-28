import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import { AuthAPI } from '../api/api';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Ana sayfa kontrolü
  const isHomePage = location.pathname === '/';

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (id) => {
    // Eğer ana sayfada değilsek, önce ana sayfaya git
    if (!isHomePage) {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    AuthAPI.getMe()
      .then((res) => {
        setUser(res.data.user.user_metadata);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  // Ana sayfaya geri döndüğünde scroll işlemi
  useEffect(() => {
    if (isHomePage && location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location, isHomePage]);

  const handleSignOut = async () => {
    try {
      await AuthAPI.signOut();
      sessionStorage.removeItem('access_token');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Çıkış yaparken hata:', error);
    }
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        // Ana sayfada template frame yüksekliği kullan, diğer sayfalarda kullanma
        mt: isHomePage ? 'calc(var(--template-frame-height, 0px) + 28px)' : 0,
        top: isHomePage ? 'auto' : 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Sitemark />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                onClick={() => scrollToSection('features')} 
                variant="text" 
                color="info" 
                size="small"
              >
                Chat
              </Button>
              <Link to="/law-offices" style={{ textDecoration: 'none' }}>
                <Button variant="text" color="info" size="small">
                  Hukuk Büroları
                </Button>
              </Link>
              <Button 
                onClick={() => scrollToSection('features')} 
                variant="text" 
                color="info" 
                size="small"
              >
                Özellikler
              </Button>
              <Button 
                onClick={() => scrollToSection('testimonials')} 
                variant="text" 
                color="info" 
                size="small"
              >
                Geri Bildirimler
              </Button>
              <Button 
                onClick={() => scrollToSection('highlights')} 
                variant="text" 
                color="info" 
                size="small"
              >
                Öne Çıkanlar
              </Button>
              <Button 
                onClick={() => scrollToSection('faq')} 
                variant="text" 
                color="info" 
                size="small" 
                sx={{ minWidth: 0 }}
              >
                SSS
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {user ? (
              <>
                <Typography variant="body2" color="text.primary">
                  Hoş geldiniz, {user.name} {user.surname}
                </Typography>
                <Button color="primary" variant="outlined" size="small" onClick={handleSignOut}>
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button color="primary" variant="text" size="small">
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button color="primary" variant="contained" size="small">
                    Kayıt Ol
                  </Button>
                </Link>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: isHomePage ? 'var(--template-frame-height, 0px)' : 0,
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => { scrollToSection('features'); setOpen(false); }}>
                  Chat
                </MenuItem>
                <MenuItem onClick={() => { navigate('/law-offices'); setOpen(false); }}>
                  Hukuk Büroları
                </MenuItem>
                <MenuItem onClick={() => { scrollToSection('features'); setOpen(false); }}>
                  Özellikler
                </MenuItem>
                <MenuItem onClick={() => { scrollToSection('testimonials'); setOpen(false); }}>
                  Geri Bildirimler
                </MenuItem>
                <MenuItem onClick={() => { scrollToSection('highlights'); setOpen(false); }}>
                  Öne Çıkanlar
                </MenuItem>
                <MenuItem onClick={() => { scrollToSection('faq'); setOpen(false); }}>
                  SSS
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                {user ? (
                  <>
                    <MenuItem>
                      <Typography variant="body2" sx={{ mx: 'auto' }}>
                        Hoş geldiniz, {user.name}
                      </Typography>
                    </MenuItem>
                    <MenuItem>
                      <Button fullWidth onClick={handleSignOut}>
                        Çıkış Yap
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Link to="/sign-up">
                        <Button color="primary" variant="contained" fullWidth>
                          Kayıt Ol
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/sign-in">
                        <Button color="primary" variant="outlined" fullWidth>
                          Giriş Yap
                        </Button>
                      </Link>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}