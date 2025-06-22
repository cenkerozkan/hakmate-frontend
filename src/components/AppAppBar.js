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
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (id) => {
    if (!isHomePage) {
      navigate('/', { state: { scrollTo: id } });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll pozisyonunu takip et
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100); // 100px scroll sonrası yapışsın
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    AuthAPI.getMe()
      .then((res) => {
        setUser(res.data.user.user_metadata);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
      navigate('/sign-in', { replace: true });
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
        mt: isHomePage ? (isScrolled ? 0 : { xs: '16px', md: 'calc(var(--template-frame-height, 0px) + 28px)' }) : 0,
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar 
          variant="dense" 
          disableGutters
          sx={{
            borderRadius: isHomePage && !isScrolled ? `calc(8px + 8px)` : isScrolled ? '0px' : `calc(8px + 8px)`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: { xs: 1, md: 0 } }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Sitemark />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Link to="/chat" style={{ textDecoration: 'none' }}>
                <Button variant="text" color="info" size="small">
                  Chat
                </Button>
              </Link>
              <Link to="/law-offices" style={{ textDecoration: 'none' }}>
                <Button variant="text" color="info" size="small">
                  Hukuk Büroları
                </Button>
              </Link>
              <Button onClick={() => scrollToSection('features')} variant="text" color="info" size="small">
                Özellikler
              </Button>
              <Button onClick={() => scrollToSection('testimonials')} variant="text" color="info" size="small">
                Geri Bildirimler
              </Button>
              <Button onClick={() => scrollToSection('highlights')} variant="text" color="info" size="small">
                Öne Çıkanlar
              </Button>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <Button variant="text" color="info" size="small">
                  İletişim
                </Button>
              </Link>
              <Button onClick={() => scrollToSection('faq')} variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                SSS
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {!loading && (
              user ? (
                <>
                  <Typography variant="body2" color="text.primary" noWrap>
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
              )
            )}
            <ColorModeIconDropdown />
          </Box>

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
                  top: isHomePage ? (isScrolled ? 0 : 'var(--template-frame-height, 0px)') : 0,
                  maxHeight: '100vh',
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'background.default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 1,
                  overflowY: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem sx={{ fontSize: '1rem' }} onClick={() => { navigate('/chat'); setOpen(false); }}>
                  Chat
                </MenuItem>
                <MenuItem sx={{ fontSize: '1rem' }} onClick={() => { navigate('/law-offices'); setOpen(false); }}>
                  Hukuk Büroları
                </MenuItem>
                <MenuItem sx={{ fontSize: '1rem' }} onClick={() => { scrollToSection('features'); setOpen(false); }}>
                  Özellikler
                </MenuItem>
                <MenuItem sx={{ fontSize: '1rem' }} onClick={() => { scrollToSection('testimonials'); setOpen(false); }}>
                  Geri Bildirimler
                </MenuItem>
                <MenuItem sx={{ fontSize: '1rem' }} onClick={() => { scrollToSection('highlights'); setOpen(false); }}>
                  Öne Çıkanlar
                </MenuItem>
                <MenuItem sx={{ fontSize: '1rem' }} onClick={() => { navigate('/contact'); setOpen(false); }}>
                  İletişim
                </MenuItem>
                <MenuItem sx={{ fontSize: '1rem' }} onClick={() => { scrollToSection('faq'); setOpen(false); }}>
                  SSS
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                {!loading && (
                  user ? (
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
                        <Link to="/sign-up" style={{ width: '100%' }}>
                          <Button color="primary" variant="contained" fullWidth>
                            Kayıt Ol
                          </Button>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/sign-in" style={{ width: '100%' }}>
                          <Button color="primary" variant="outlined" fullWidth>
                            Giriş Yap
                          </Button>
                        </Link>
                      </MenuItem>
                    </>
                  )
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}