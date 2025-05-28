import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from './SitemarkIcon';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Telif Hakkı © '}
      <Link color="text.secondary" href="#">
        HakMate
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          gap: { xs: 6, sm: 0 },
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' }, mx: 'auto' }}>
            <SitemarkIcon />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              E-posta servisimize abone ol.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Haftalık güncellemler için abone ol!
            </Typography>
            <InputLabel htmlFor="email-newsletter">Email</InputLabel>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              useFlexGap
              sx={{ width: '100%', alignItems: { xs: 'stretch', sm: 'flex-end' } }}
            >
              <TextField
                id="email-newsletter"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="E-posta adresinizi giriniz."
                placeholder="E-posta adresiniz"
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': 'E-posta adresinizi giriniz.',
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
                Abone Ol
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: { xs: 4, sm: 0 },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            HakMate
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Hakkımızda
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            İletişim
          </Link>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: { xs: 4, sm: 0 },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Kurumsal
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Hizmet Politikası
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            KVKK
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            İletişim
          </Link>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 2,
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Box>
          <Link color="text.secondary" variant="body2" href="#">
            Hizmet Politikası
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            KVKK
          </Link>
          <Copyright />
        </Box>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          justifyContent="center"
          sx={{ color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="#"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="#"
            aria-label="X"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="#"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
