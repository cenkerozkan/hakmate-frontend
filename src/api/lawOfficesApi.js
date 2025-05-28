import axiosInstance from './api';

export const LawOfficesAPI = {
  // Supabase'den yakındaki hukuk bürolarını getir
  getNearbyOffices: (lat, lng, radius = 5) => 
    axiosInstance.get('/law-offices/nearby', {
      params: { lat, lng, radius }
    }),

  // Google'dan yakındaki hukuk bürolarını getir
  getNearbyOfficesFromGoogle: (lat, lng, radius = 5) => 
    axiosInstance.get('/law-offices/nearby-google', {
      params: { lat, lng, radius }
    }),

  // Tüm hukuk bürolarını getir (konum olmadan) - Akıllı endpoint
  getAllOffices: () => 
    axiosInstance.get('/law-offices'),

  // Alternatif: Sadece tüm büroları getir (konum kontrolü olmadan)
  getAllOfficesOnly: () => 
    axiosInstance.get('/law-offices/all'),

  // Akıllı endpoint - konum varsa yakınları, yoksa tümünü getir
  getOffices: (lat = null, lng = null, radius = 5) => {
    const params = {};
    
    if (lat && lng) {
      params.lat = lat;
      params.lng = lng;
      params.radius = radius;
    }

    return axiosInstance.get('/law-offices', { params });
  }
};

export default LawOfficesAPI;