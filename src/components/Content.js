import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { SitemarkIcon } from './CustomIcons';
import { Link } from 'react-router-dom';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon fontSize="large" />,
    title: 'İhtiyacınıza Uyum Sağlayan Performans',
    description:
      'Platformumuz, farklı hukuk alanlarına ve iş akışlarına kolayca adapte olur; işlerinizi hızlandırır ve süreci sadeleştirir.',
  },
  {
    icon: <ConstructionRoundedIcon fontSize="large" />,
    title: 'Uzun Süreli Kullanım için Tasarlandı',
    description:
      'Dayanıklı yapısı ve güvenilirliğiyle, hukuk teknolojilerine yaptığınız yatırımın karşılığını fazlasıyla alırsınız.',
  },
  {
    icon: <ThumbUpAltRoundedIcon fontSize="large" />,
    title: 'Üst Düzey Kullanıcı Deneyimi',
    description:
      'Sade ve sezgisel arayüzüyle, tüm hukuk profesyonelleri için kolay erişim ve verimli kullanım sunar.',
  },
  {
    icon: <AutoFixHighRoundedIcon fontSize="large" />,
    title: 'Yenilikçi Fonksiyonlar',
    description:
      'Gelişmiş yapay zeka, karar analizleri ve içgörülerle sektörde yeni standartlar belirler.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignSelf: 'center',
        gap: 4,
        maxWidth: 450,
        px: { xs: 2, md: 0 },
      }}
    >
      <Link to="/">
        <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <SitemarkIcon style={{ pointerEvents: 'auto', cursor: 'pointer' }} />
        </Box>
      </Link>
      {items.map((item, index) => (
        <Stack
          key={index}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            gap: 2,
            alignItems: { xs: 'flex-start', sm: 'center' },
            textAlign: { xs: 'left', sm: 'inherit' },
          }}
        >
          {item.icon}
          <Box>
            <Typography
              gutterBottom
              sx={{ fontWeight: 'medium', fontSize: { xs: '1rem', md: '1.1rem' } }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '0.95rem' } }}
            >
              {item.description}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
