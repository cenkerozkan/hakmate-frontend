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
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Link to="/">
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <SitemarkIcon style={{ pointerEvents: 'auto', cursor: 'pointer' }} />
        </Box>
      </Link>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
