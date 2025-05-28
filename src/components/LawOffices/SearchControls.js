// src/components/LawOffices/SearchControls.js
import React from 'react';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  LocationOn,
  Storage,
} from '@mui/icons-material';

export default function SearchControls({
  hasLocation,
  latitude,
  longitude,
  radius,
  maxResults,
  loading,
  locationLoading,
  allOffices,
  totalFilteredOffices,
  startIndex,
  endIndex,
  onRadiusChange,
  onMaxResultsChange,
  onSearch,
  onRefreshLocation,
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card 
      sx={{ 
        mb: 4, 
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
          : '0 8px 32px rgba(0, 0, 0, 0.06)',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Filtreleme Kontrolleri */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={4} 
          alignItems="center"
          justifyContent="center"
        >
          {/* Gösterilecek Sayı */}
          <FormControl size="medium" sx={{ minWidth: 200 }}>
            <InputLabel 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '1rem',
                '&.Mui-focused': { 
                  color: 'primary.main'
                }
              }}
            >
              Gösterilecek Büro Sayısı
            </InputLabel>
            <Select
              value={maxResults}
              label="Gösterilecek Büro Sayısı"
              onChange={(e) => onMaxResultsChange(e.target.value)}
              sx={{
                fontWeight: 600,
                borderRadius: 3,
                fontSize: '1rem',
                minHeight: 56,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                  borderWidth: 2,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'background.paper',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 1,
                    '& .MuiMenuItem-root': {
                      color: 'text.primary',
                      fontWeight: 500,
                      py: 2,
                      px: 3,
                      fontSize: '1rem',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(139, 21, 56, 0.08)' : 'rgba(139, 21, 56, 0.04)',
                        color: 'primary.main'
                      },
                      '&.Mui-selected': {
                        bgcolor: isDarkMode ? 'rgba(139, 21, 56, 0.15)' : 'rgba(139, 21, 56, 0.08)',
                        color: 'primary.main',
                        fontWeight: 700,
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(139, 21, 56, 0.2)' : 'rgba(139, 21, 56, 0.12)',
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value={10}>En yakın 10 büro</MenuItem>
              <MenuItem value={20}>En yakın 20 büro</MenuItem>
              <MenuItem value={50}>En yakın 50 büro</MenuItem>
              <MenuItem value={100}>En yakın 100 büro</MenuItem>
              <MenuItem value={allOffices.length || 999}>Tüm bürolar</MenuItem>
            </Select>
          </FormControl>

          {/* Durum göstergesi */}
          {hasLocation ? (
            <Chip
              icon={<LocationOn />}
              label="Konumunuz kullanılıyor"
              sx={{
                bgcolor: isDarkMode ? 'rgba(46, 125, 50, 0.15)' : 'rgba(46, 125, 50, 0.08)',
                color: 'success.main',
                borderRadius: 4,
                px: 2,
                py: 1,
                height: 44,
                '& .MuiChip-label': {
                  fontWeight: 700,
                  fontSize: '0.95rem'
                },
                '& .MuiChip-icon': {
                  color: 'success.main',
                  fontSize: 20
                },
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(46, 125, 50, 0.2)' 
                  : '0 4px 12px rgba(46, 125, 50, 0.1)'
              }}
            />
          ) : (
            <Chip
              icon={<Storage />}
              label="Örnek veriler gösteriliyor"
              sx={{
                bgcolor: isDarkMode ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.08)',
                color: 'warning.main',
                borderRadius: 4,
                px: 2,
                py: 1,
                height: 44,
                '& .MuiChip-label': {
                  fontWeight: 700,
                  fontSize: '0.95rem'
                },
                '& .MuiChip-icon': {
                  color: 'warning.main',
                  fontSize: 20
                },
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(255, 152, 0, 0.2)' 
                  : '0 4px 12px rgba(255, 152, 0, 0.1)'
              }}
            />
          )}
        </Stack>

        {/* Sonuç bilgisi */}
        {!loading && allOffices.length > 0 && (
          <Box 
            mt={4} 
            p={4} 
            sx={{ 
              bgcolor: isDarkMode ? 'rgba(139, 21, 56, 0.08)' : 'rgba(139, 21, 56, 0.03)', 
              borderRadius: 4,
              border: '2px solid',
              borderColor: isDarkMode ? 'rgba(139, 21, 56, 0.2)' : 'rgba(139, 21, 56, 0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #8B1538 0%, #A91850 100%)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 700,
                textAlign: 'center',
                fontSize: '1.1rem',
                mb: 1
              }}
            >
              {hasLocation 
                ? `📍 Konumunuz çevresinde ${allOffices.length} hukuk bürosu bulundu`
                : `📋 Toplam ${allOffices.length} hukuk bürosu listelendi`
              }
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              Şu anda {startIndex}-{endIndex} arası gösteriliyor • Sayfa başına 5 büro
            </Typography>
          </Box>
        )}

        {/* Loading durumu */}
        {loading && (
          <Box 
            mt={4} 
            p={4} 
            sx={{ 
              bgcolor: isDarkMode ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.03)', 
              borderRadius: 4,
              border: '2px solid',
              borderColor: isDarkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              {hasLocation ? '🔍 Yakındaki hukuk büroları aranıyor...' : '📋 Hukuk büroları yükleniyor...'}
            </Typography>
          </Box>
        )}

        {/* Konum izni yok durumu - sadece ilk yüklemede */}
        {!hasLocation && !loading && allOffices.length === 0 && (
          <Box 
            mt={4} 
            p={4} 
            sx={{ 
              bgcolor: isDarkMode ? 'rgba(156, 39, 176, 0.08)' : 'rgba(156, 39, 176, 0.03)', 
              borderRadius: 4,
              border: '2px solid',
              borderColor: isDarkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.08)',
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '1.1rem',
                mb: 2
              }}
            >
              💡 Konum erişimi ile daha iyi deneyim
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1rem',
                fontWeight: 500,
                lineHeight: 1.6
              }}
            >
              Tarayıcınızdan konum izni vererek size en yakın hukuk bürolarını görebilir,
              <br />
              mesafe bilgileriyle daha kolay seçim yapabilirsiniz.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}