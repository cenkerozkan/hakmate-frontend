import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const tiers = [
  {
    title: 'Başlangıç',
    price: '0',
    description: [
      '🧑‍⚖️ 1 kullanıcı',
      '📄 Aylık 5 belge analizi',
      '🔍 5 içtihat tarama hakkı',
      '📚 Yardım merkezi erişimi',
      '✉️ E-posta desteği'
    ],
    buttonText: 'Ücretsiz kayıt ol!',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  {
    title: 'Profesyonel',
    subheader: 'Önerilen Paket',
    price: '249',
    description: [
      '👥 5 kullanıcıya kadar',
      '📄 Aylık 50 belge analizi',
      '🔍 Sınırsız içtihat tarama',
      '📑 Akıllı özetleme ve metin önerileri',
      '📚 Yardım merkezi erişimi',
      '⚡️ Öncelikli e-posta desteği',
      '🤖 Dava strateji önerileri'
    ],
    buttonText: 'Şimdi Satın Al',
    buttonVariant: 'contained',
    buttonColor: 'secondary',
  },
  {
    title: 'Kurumsal',
    price: '749',
    description: [
      '🏢 20+ kullanıcı',
      '📄 Aylık 200+ belge analizi',
      '🔍 Sınırsız içtihat ve mevzuat tarama',
      '📑 Gelişmiş yapay zeka modülleri',
      '📞 Telefon ve e-posta desteği',
      '🧠 Kuruma özel model eğitimi',
      '📊 Raporlama ve ekip yönetimi araçları'
    ],
    buttonText: 'İletişime Geç',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
];

export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Fiyatlandırma
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Potansiyel kullanıcılarımızın ihtiyaçlarına göre ayırdığımız paketlerimiz. İhtiyacınız olan kapasite ve özellikler ile tam size göre!
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
      >
        {tiers.map((tier) => (
          <Grid
            size={{ xs: 12, sm: tier.title === 'Enterprise' ? 12 : 6, md: 4 }}
            key={tier.title}
          >
            <Card
              sx={[
                {
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                },
                tier.title === 'Professional' &&
                  ((theme) => ({
                    border: 'none',
                    background:
                      'radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))',
                    boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                    ...theme.applyStyles('dark', {
                      background:
                        'radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))',
                      boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
                    }),
                  })),
              ]}
            >
              <CardContent>
                <Box
                  sx={[
                    {
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    },
                    tier.title === 'Professional'
                      ? { color: 'grey.100' }
                      : { color: '' },
                  ]}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === 'Professional' && (
                    <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
                  )}
                </Box>
                <Box
                  sx={[
                    {
                      display: 'flex',
                      alignItems: 'baseline',
                    },
                    tier.title === 'Professional'
                      ? { color: 'grey.50' }
                      : { color: null },
                  ]}
                >
                  <Typography component="h3" variant="h2">
                    ₺{tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; Aylık
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}
                  >
                    <CheckCircleRoundedIcon
                      sx={[
                        {
                          width: 20,
                        },
                        tier.title === 'Professional'
                          ? { color: 'primary.light' }
                          : { color: 'primary.main' },
                      ]}
                    />
                    <Typography
                      variant="subtitle2"
                      component={'span'}
                      sx={[
                        tier.title === 'Professional'
                          ? { color: 'grey.50' }
                          : { color: null },
                      ]}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color={tier.buttonColor}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
