import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const items = [
  {
    icon: <AssuredWorkloadIcon />,
    title: 'Durum Açıklama',
    description:
      'Olayın mevcut durumu ve temel hukuki gelişmeler özetlenir.',
    imageLight: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://i.hizliresim.com'}/h2ka7z2.jpg")`,
    imageDark: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://i.hizliresim.com'}/h2ka7z2.jpg")`,
  },
  {
    icon: <EmojiObjectsIcon />,
    title: 'Çözüm Önerileri',
    description:
      'Olayla ilgili olası hukuki çözüm yolları değerlendirilir.',
    imageLight: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://i.hizliresim.com'}/gvtti5b.jpg")`,
    imageDark: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://i.hizliresim.com'}/gvtti5b.jpg")`,
  },
  {
    icon: <MenuBookIcon />,
    title: 'Terimlerin Kaynaklı Açıklaması',
    description:
      'Kullanılan hukuki terimlerin tanımları ve yasal dayanakları açıklanır.',
    imageLight: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://i.hizliresim.com'}/jieunrb.jpg")`,
    imageDark: `url("${process.env.TEMPLATE_IMAGE_URL || 'https://i.hizliresim.com'}/jieunrb.jpg")`,
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) return null;

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 200,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            backgroundImage: 'var(--items-imageLight)',
            ...theme.applyStyles('dark', {
              backgroundImage: 'var(--items-imageDark)',
            }),
          })}
          style={{
            '--items-imageLight': items[selectedItemIndex].imageLight,
            '--items-imageDark': items[selectedItemIndex].imageDark,
          }}
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 'medium',
              color: 'text.primary',
            }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { xs: '100%', sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary', textAlign: { xs: 'center', md: 'left' } }}
        >
          Ürünümüzün Özellikleri
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: { xs: 4, sm: 6 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Yapay zeka ile belirtilen durumları örnekler ile açıklama, çözüm önerileri önerme, 
          bilinmeyen terimleri açıklama, hepsi tek bir yerde HakMate.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                    textAlign: 'left',
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      color: 'text.secondary',
                      textTransform: 'none',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
            height: 'var(--items-image-height)',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={(theme) => ({
                m: 'auto',
                width: '100%',
                aspectRatio: 1 / 1,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPositionY: 'center',
                backgroundImage: 'var(--items-imageLight)',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'var(--items-imageDark)',
                }),
              })}
              style={{
                '--items-imageLight': items[selectedItemIndex].imageLight,
                '--items-imageDark': items[selectedItemIndex].imageDark,
              }}
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}