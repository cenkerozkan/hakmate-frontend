// src/components/LawOffices/LawOfficeCard.js
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Typography,
  Box,
  Stack,
  Rating,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Language,
  Directions,
} from '@mui/icons-material';

export default function LawOfficeCard({ office, onGetDirections }) {
  const formatDistance = (distance) => {
    if (!distance) return '';
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(139, 21, 56, 0.15)',
        },
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}
    >
      {/* Header with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B1538 0%, #A91850 100%)',
          p: 2.5,
          color: 'white'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              flexGrow: 1, 
              mr: 1,
              fontWeight: 700,
              fontSize: '1.1rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {office.name}
          </Typography>
          {office.distance && (
            <Chip 
              label={formatDistance(office.distance)} 
              size="small" 
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          )}
        </Box>

        {office.rating && (
          <Box display="flex" alignItems="center" gap={1} mt={1.5}>
            <Rating 
              value={office.rating} 
              readOnly 
              size="small" 
              precision={0.1}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#FFD700',
                },
                '& .MuiRating-iconEmpty': {
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                fontSize: '0.8rem'
              }}
            >
              ({office.rating})
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" alignItems="flex-start" gap={1.5} mb={3}>
          <LocationOn 
            sx={{ 
              color: 'primary.main', 
              fontSize: 20, 
              mt: 0.2,
              flexShrink: 0
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '0.9rem'
            }}
          >
            {office.address}
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {office.phone && (
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Phone 
                  fontSize="small" 
                  sx={{ color: 'primary.main' }}
                />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                <a 
                  href={`tel:${office.phone}`} 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#8B1538'}
                  onMouseLeave={(e) => e.target.style.color = 'inherit'}
                >
                  {office.phone}
                </a>
              </Typography>
            </Box>
          )}

          {office.website && (
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Language 
                  fontSize="small" 
                  sx={{ color: 'primary.main' }}
                />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: 'primary.main'
                }}
              >
                <a 
                  href={office.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    textDecoration: 'none', 
                    color: '#8B1538',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#A91850'}
                  onMouseLeave={(e) => e.target.style.color = '#8B1538'}
                >
                  Web Sitesi
                </a>
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          size="large"
          startIcon={<Directions />}
          onClick={() => onGetDirections(office)}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#8B1538',
            color: 'white',
            fontWeight: 700,
            py: 1.5,
            borderRadius: 2.5,
            textTransform: 'none',
            fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(139, 21, 56, 0.3)',
            '&:hover': {
              bgcolor: '#A91850',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 30px rgba(139, 21, 56, 0.4)',
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          Yol Tarifi Al
        </Button>
      </CardActions>
    </Card>
  );
}