// src/components/LawOffices/LawOffices.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Pagination,
} from '@mui/material';
import { LocationOn, MyLocation } from '@mui/icons-material';
import { useLocation } from '../../hooks/useLocation';
import { LawOfficesAPI } from '../../api/lawOfficesApi';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import LawOfficeCard from '../LawOffices/LawOfficesCard';
import SearchControls from '../LawOffices/SearchControls';

export default function LawOffices() {
  const [allOffices, setAllOffices] = useState([]);
  const [displayedOffices, setDisplayedOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5);
  const [maxResults, setMaxResults] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Sayfa başına 5 büro
  
  const { latitude, longitude, error: locationError, loading: locationLoading, refreshLocation, hasLocation } = useLocation();
  const { toast, showError, hideToast } = useToast();

  // Mesafe hesaplama
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const searchOffices = async () => {
    setLoading(true);
    try {
      let response;
      
      if (hasLocation) {
        response = await LawOfficesAPI.getNearbyOffices(latitude, longitude, radius);
      } else {
        response = await LawOfficesAPI.getAllOffices();
      }

      let offices = response.data || [];

      if (hasLocation && offices.length > 0) {
        offices = offices.map(office => ({
          ...office,
          distance: office.distance || calculateDistance(latitude, longitude, office.latitude, office.longitude)
        })).sort((a, b) => a.distance - b.distance);
      }

      setAllOffices(offices);
      setCurrentPage(1);
    } catch (error) {
      console.error('Hukuk büroları aranırken hata:', error);
      showError(error.response?.data?.message || 'Hukuk büroları aranırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Pagination hesaplamaları
  const totalFilteredOffices = Math.min(allOffices.length, maxResults);
  const totalPages = Math.ceil(totalFilteredOffices / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalFilteredOffices);

  // Gösterilecek büroları hesapla
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const officesToShow = allOffices.slice(0, maxResults);
    setDisplayedOffices(officesToShow.slice(start, end));
  }, [allOffices, currentPage, maxResults, itemsPerPage]);

  useEffect(() => {
    if (!locationLoading) {
      searchOffices();
    }
  }, [hasLocation, locationLoading]);

  const handleRadiusChange = (value) => {
    setRadius(value);
    setCurrentPage(1);
  };

  const handleMaxResultsChange = (value) => {
    setMaxResults(value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Sayfa değiştiğinde yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetDirections = (office) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`;
    window.open(url, '_blank');
  };

  if (locationLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          gap={3}
          sx={{
            minHeight: '50vh',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={60} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Konum bilgisi alınıyor...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (locationError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert 
          severity="error" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={refreshLocation}
              sx={{ fontWeight: 600 }}
            >
              Tekrar Dene
            </Button>
          }
          sx={{
            borderRadius: 3,
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          {locationError}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box mb={6} textAlign="center">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #8B1538 0%, #A91850 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            {hasLocation ? 'Yakınımdaki Hukuk Büroları' : 'Hukuk Büroları'}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            {hasLocation 
              ? 'Bulunduğunuz konuma en yakın hukuk bürolarını keşfedin'
              : 'Hukuk bürolarını keşfedin. Konum izni vererek yakınlarındakileri görebilirsiniz.'
            }
          </Typography>
        </Box>

        {/* Search Controls */}
        <SearchControls
          hasLocation={hasLocation}
          latitude={latitude}
          longitude={longitude}
          radius={radius}
          maxResults={maxResults}
          loading={loading}
          locationLoading={locationLoading}
          allOffices={allOffices}
          totalFilteredOffices={totalFilteredOffices}
          startIndex={startIndex}
          endIndex={endIndex}
          onRadiusChange={handleRadiusChange}
          onMaxResultsChange={handleMaxResultsChange}
          onSearch={searchOffices}
          onRefreshLocation={refreshLocation}
        />

        {/* Results - Her satırda bir büro */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {displayedOffices.map((office, index) => (
                <LawOfficeCard 
                  key={office.id || index}
                  office={office} 
                  onGetDirections={handleGetDirections}
                />
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 600,
                        borderRadius: 2,
                        mx: 0.5,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(139, 21, 56, 0.3)',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        },
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Empty State */}
            {allOffices.length === 0 && (
              <Box 
                textAlign="center" 
                py={8}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 4,
                  border: '2px dashed',
                  borderColor: 'divider',
                  mx: 2
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B1538 0%, #A91850 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(139, 21, 56, 0.3)'
                  }}
                >
                  <LocationOn sx={{ fontSize: 60, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 700,
                    mb: 2
                  }}
                >
                  {hasLocation 
                    ? 'Arama kriterlerinize uygun hukuk bürosu bulunamadı'
                    : 'Henüz hukuk bürosu kaydı bulunmuyor'
                  }
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 4,
                    maxWidth: 500,
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  {hasLocation 
                    ? 'Daha geniş bir yarıçap seçerek tekrar deneyin veya başka bir konumdan arama yapın.'
                    : 'Yakınınızdaki hukuk bürolarını görmek için konum izni verin ve en yakın profesyonelleri keşfedin.'
                  }
                </Typography>
                {!hasLocation && (
                  <Button
                    variant="contained"
                    startIcon={<MyLocation />}
                    onClick={refreshLocation}
                    size="large"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      px: 6,
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 32px rgba(139, 21, 56, 0.3)',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(139, 21, 56, 0.4)',
                      },
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    Konum İzni Ver
                  </Button>
                )}
              </Box>
            )}
          </>
        )}

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={hideToast}
        />
      </Container>
    </Box>
  );
}