import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Tarayıcınız konum hizmetlerini desteklemiyor',
        loading: false,
      }));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 dakika cache
    };

    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const handleError = (error) => {
      let errorMessage = 'Konum bilgisi alınamadı';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarından konum iznini açın.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Konum bilgisi mevcut değil';
          break;
        case error.TIMEOUT:
          errorMessage = 'Konum alma işlemi zaman aşımına uğradı';
          break;
      }

      setLocation(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  const refreshLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          error: 'Konum yenilenemedi',
          loading: false,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return {
    ...location,
    refreshLocation,
    hasLocation: location.latitude !== null && location.longitude !== null,
  };
};