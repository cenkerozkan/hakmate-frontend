import React from 'react';
import { Link } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';

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
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Sitemark />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button onClick={() => scrollToSection('features')} variant="text" color="info" size="small">
                Chat
              </Button>
              <Button onClick={() => scrollToSection('features')} variant="text" color="info" size="small">
                Özellikler
              </Button>
              <Button onClick={() => scrollToSection('testimonials')} variant="text" color="info" size="small">
                Geri Bildirimler
              </Button>
              <Button onClick={() => scrollToSection('highlights')} variant="text" color="info" size="small">
                Öne Çıkanlar
              </Button>
              <Button onClick={() => scrollToSection('faq')} variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
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
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => { scrollToSection('features'); setOpen(false); }}>Chat</MenuItem>
                <MenuItem onClick={() => { scrollToSection('features'); setOpen(false); }}>Özellikler</MenuItem>
                <MenuItem onClick={() => { scrollToSection('testimonials'); setOpen(false); }}>Geri Bildirimler</MenuItem>
                <MenuItem onClick={() => { scrollToSection('highlights'); setOpen(false); }}>Öne Çıkanlar</MenuItem>
                <MenuItem onClick={() => { scrollToSection('faq'); setOpen(false); }}>SSS</MenuItem>
                <Divider sx={{ my: 3 }} />
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
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
