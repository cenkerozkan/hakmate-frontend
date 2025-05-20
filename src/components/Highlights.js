import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'İhtiyacınıza Uyum Sağlayan Performans',
    description:
      'Platformumuz, farklı hukuk alanlarına ve iş akışlarına kolayca adapte olur; işlerinizi hızlandırır ve süreci sadeleştirir.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Uzun Süreli Kullanım için Tasarlandı',
    description:
      'Dayanıklı yapısı ve güvenilirliğiyle, hukuk teknolojilerine yaptığınız yatırımın karşılığını fazlasıyla alırsınız.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Üst Düzey Kullanıcı Deneyimi',
    description:
      'Sade ve sezgisel arayüzüyle, tüm hukuk profesyonelleri için kolay erişim ve verimli kullanım sunar.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Yenilikçi Fonksiyonlar',
    description:
      'Gelişmiş yapay zeka, karar analizleri ve içgörülerle sektörde yeni standartlar belirler.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Güvenilir Destek',
    description:
      'Satın alma öncesi ve sonrası ulaşılabilir teknik destek ile her zaman yanınızdayız.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'Detaylarda Mükemmellik',
    description:
      'Küçük dokunuşların büyük fark yarattığı bu platformda, her özellik titizlikle tasarlanmıştır.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
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
          <Typography component="h2" variant="h4" gutterBottom>
            Öne Çıkanlar
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Hakmate’in neden öne çıktığını keşfedin: esnek altyapı, 
            uzun ömürlü sistem mimarisi, kullanıcı dostu tasarım ve yenilikçi 
            özellikler. Güvenilir destek ve detaylara verilen önem ile fark yaratır.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
