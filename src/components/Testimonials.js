import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Ensure your image paths are publicly accessible URLs
const userTestimonials = [
  {
    avatar: <Avatar alt="Mehmet Demir" src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150" />,
    name: 'Mehmet Demir',
    occupation: 'Kurucu Ortak, Demir Hukuk Bürosu',
    testimonial:
      "Özellikle karmaşık davaların hazırlık sürecinde Hukukmate vazgeçilmez bir asistan haline geldi. Yapay zeka ile desteklenmiş platform, emsal kararlara erişimi demokratikleştiriyor.",
  },
  {
    avatar: <Avatar alt="Travis Howard" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" />,
    name: 'Travis Howard',
    occupation: 'Avukat, Howard & Partners',
    testimonial:
      "Hukukmate'in kullanıcı dostu arayüzü ve hızlı veri erişimi, dava hazırlığında ciddi zaman kazandırıyor. Özellikle içtihat taraması artık çok daha verimli.",
  },
  {
    avatar: <Avatar alt="Cindy Baker" src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150" />,
    name: 'Cindy Baker',
    occupation: 'CTO, LegalTech Solutions',
    testimonial:
      "Yapay zekâ destekli analiz motoru sayesinde müvekkil dosyalarını kısa sürede anlamlandırabiliyoruz. Hukukmate, dijital dönüşümün gerçek karşılığı.",
  },
  {
    avatar: <Avatar alt="Julia Stewart" src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150" />,
    name: 'Julia Stewart',
    occupation: 'Kıdemli Hukuk Danışmanı',
    testimonial:
      "Platformun detaylara verdiği önem ve sadeleştirilmiş hukuk dili sayesinde, ekip içi değerlendirmelerde büyük kolaylık sağlıyor.",
  },
  {
    avatar: <Avatar alt="John Smith" src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150" />,
    name: 'John Smith',
    occupation: 'Ürün Yöneticisi, LegalWorks',
    testimonial:
      "Farklı hukuk teknolojilerini denedim, ancak Hukukmate özgün özellikleriyle öne çıkıyor. Özellikle karar analizleri benzersiz düzeyde derinlik sunuyor.",
  },
  {
    avatar: <Avatar alt="Daniel Wolf" src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150" />,
    name: 'Daniel Wolf',
    occupation: 'CDO, Dijital Hukuk Ağı',
    testimonial:
      "Hukukmate'in dayanıklı ve güvenilir yapısı, uzun vadeli kullanım için ideal. Platformun her detayında kalite hissediliyor.",
  },
];

export default function Testimonials() {
  const theme = useTheme();
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Pad the testimonials array for infinite looping effect
  // We add 'cardsToShow' elements to both ends of the array.
  const totalTestimonials = userTestimonials.length;
  const paddedTestimonials = [
    ...userTestimonials.slice(-cardsToShow), // Elements from the end
    ...userTestimonials, // Original elements
    ...userTestimonials.slice(0, cardsToShow), // Elements from the beginning
  ];

  // Initial index points to the start of the *original* testimonials within the padded array
  const [currentIndex, setCurrentIndex] = useState(cardsToShow);

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setCardsToShow(1);
      } else if (window.innerWidth < 960) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update currentIndex when cardsToShow changes, to keep the visible window correct
  useEffect(() => {
    setCurrentIndex(cardsToShow);
  }, [cardsToShow]);


  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    // If we've transitioned to the duplicate beginning, jump to the real beginning
    if (currentIndex >= totalTestimonials + cardsToShow) {
      setCurrentIndex(cardsToShow); // Jump to the start of the original testimonials
    } 
    // If we've transitioned to the duplicate end, jump to the real end
    else if (currentIndex < cardsToShow) {
      setCurrentIndex(totalTestimonials + currentIndex); // Jump to the end of the original testimonials
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1); // Move by one card
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1); // Move by one card
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]); // Depend on currentIndex and isTransitioning

  const getTransformValue = () => {
    const cardWidthPercentage = 100 / (paddedTestimonials.length / cardsToShow);
    return `translateX(-${(currentIndex * (100 / paddedTestimonials.length))}%)`;
  };

  // Calculate the dot indicator position
  const getDotIndex = () => {
    let dotIndex = (currentIndex - cardsToShow);
    if (dotIndex < 0) {
      dotIndex += totalTestimonials;
    } else if (dotIndex >= totalTestimonials) {
      dotIndex -= totalTestimonials;
    }
    return Math.floor(dotIndex / cardsToShow);
  };


  return (
    <Container
      id="testimonials"
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
          Kullanıcılarımız Ne Diyor?
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Hakmate'in avukatlara, hukuk departmanlarına ve öğrencilere nasıl yardımcı olduğunu keşfedin.
        </Typography>
      </Box>

      {/* Slider Container */}
      <Box sx={{ position: 'relative', width: '100%', maxWidth: '1200px' }}>
        {/* Navigation Buttons */}
        <IconButton
          onClick={prevSlide}
          disabled={isTransitioning}
          sx={{
            position: 'absolute',
            left: -24,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            width: 48,
            height: 48,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '&:disabled': {
              opacity: 0.5,
            },
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <ArrowBackIosIcon sx={{ ml: 0.5 }} />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          disabled={isTransitioning}
          sx={{
            position: 'absolute',
            right: -24,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            width: 48,
            height: 48,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            '&:disabled': {
              opacity: 0.5,
            },
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        {/* Cards Container */}
        <Box
          sx={{
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: `${(paddedTestimonials.length / cardsToShow) * 100}%`, // Total width for all padded cards
              transform: getTransformValue(),
              transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none', // Apply transition only when moving
              justifyContent: 'flex-start', // Align items to the start
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {paddedTestimonials.map((testimonial, index) => (
              <Box
                key={`${testimonial.name}-${index}-padded`} // Unique key for padded array
                sx={{
                  flex: `0 0 ${100 / paddedTestimonials.length}%`, // Each card takes its calculated width
                  px: 1,
                  display: 'flex',
                  // Ensure consistent sizing across all cards
                  width: `${100 / cardsToShow}%`, 
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0) scale(1)',
                    opacity: 1,
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        fontSize: '1rem'
                      }}
                    >
                      "{testimonial.testimonial}"
                    </Typography>
                  </CardContent>
                  <CardHeader
                    avatar={testimonial.avatar}
                    title={
                      <Typography variant="subtitle1" fontWeight="600">
                        {testimonial.name}
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.occupation}
                      </Typography>
                    }
                    sx={{ pt: 0 }}
                  />
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Dots Indicator */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            gap: 1.5,
          }}
        >
          {Array.from({ length: Math.ceil(totalTestimonials / cardsToShow) }).map((_, index) => (
            <Box
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setCurrentIndex(cardsToShow + (index * cardsToShow));
                }
              }}
              sx={{
                width: getDotIndex() === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getDotIndex() === index ? 'primary.main' : 'action.disabled',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: getDotIndex() === index ? 'scale(1.2)' : 'scale(1)',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>

        {/* Mobile Navigation Buttons */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'center',
            gap: 3,
            mt: 3,
          }}
        >
          <IconButton 
            onClick={prevSlide} 
            disabled={isTransitioning}
            sx={{ 
              backgroundColor: 'background.paper', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)',
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            <ArrowBackIosIcon sx={{ ml: 0.5 }} />
          </IconButton>
          <IconButton 
            onClick={nextSlide} 
            disabled={isTransitioning}
            sx={{ 
              backgroundColor: 'background.paper', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)',
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
}