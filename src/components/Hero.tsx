import React, { useState, useEffect } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedGamingBackground from './AnimatedGamingBackground';
import { gamesService } from '../services/supabaseService';
import { Game } from '../config/supabase';

// Specific catalog games featured in the community banner's sliding row,
// in display order. Missing/removed IDs are silently skipped at render time.
const COMMUNITY_BANNER_GAME_IDS = [
  '7d67f10e-c8b9-4c03-988f-8fab9e38620c', // Call of Duty: Modern Warfare
  'f2cee1d6-07c8-4a9f-944f-a9623d7eb87c', // Mafia: The Old Country
  '97046936-22e5-4920-bc63-496cda964175', // Marvel's Wolverine (Pre-Order)
  'fb6dfe60-d846-4e81-8765-0d23ab6836ca', // GTA 6 (Pre-Order)
  '9e4b2b9b-7ba1-4e55-9c87-f4721c33bce1', // 007 First Light
  '3519d831-ca1d-4625-bf62-099f20ccde7c', // Resident Evil Requiem
  'fff3a43a-f608-4e55-9737-5f9d47ff6a3b', // Assassins Creed Black Flag Resynced
];

const SPARKLE_POSITIONS = [
  { top: '15%', left: '8%', size: 'w-3 h-3', delay: '0s' },
  { top: '28%', left: '85%', size: 'w-4 h-4', delay: '0.4s' },
  { top: '65%', left: '15%', size: 'w-3 h-3', delay: '0.8s' },
  { top: '75%', left: '90%', size: 'w-3 h-3', delay: '1.2s' },
  { top: '10%', left: '55%', size: 'w-2.5 h-2.5', delay: '1.6s' },
  { top: '85%', left: '45%', size: 'w-4 h-4', delay: '2s' },
];

interface HeroProps {
  onShopBestsellers: () => void;
  onBrowseCategories: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopBestsellers, onBrowseCategories }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [communityBannerGames, setCommunityBannerGames] = useState<Game[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    gamesService.getAll({ limit: 1000 }).then((res) => {
      const byId = new Map(res.data.map((g) => [g.id, g]));
      const ordered = COMMUNITY_BANNER_GAME_IDS
        .map((id) => byId.get(id))
        .filter((g): g is Game => !!g);
      setCommunityBannerGames(ordered);
    });
  }, []);

  const goToNextSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % slides.length);
};

const goToPrevSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
};

const goToAllGames = () => {
 navigate('/games');
};


  // Auto-slide every 5 seconds
  useEffect(() => {
     if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const slides = [
    // PREVIEW ONLY — animated gaming background slide, not yet approved for production.
    // Uncomment to preview locally; keep out of prod builds until confirmed.
    // {
    //   title: "🎮 PREMIUM GAMING 🎮",
    //   subtitle: "Best Games, Best Prices",
    //   description: "Experience the latest PS4 & PS5 titles at unbeatable prices",
    //   image: "",
    //   overlay: "",
    //   buttonText: "Shop Now",
    //   buttonAction: onShopBestsellers,
    //   isBanner: false,
    //   isAnimatedBg: true,
    // },
  //   {
  //   title: "",
  //   subtitle: "",
  //   description: "",
  //   image: "/purple modern 11.11 50 discount instagram post (1024 x 768 mm)_20251203_125637_0000.jpg",
  //   overlay: "",
  //   buttonText: "",
  //   buttonAction: () => {},
  //   isBanner: true,
  // },
    {
    title: "",
    subtitle: "",
    description: "",
    image: "/hero-community-banner.jpg",
    overlay: "",
    buttonText: "",
    buttonAction: () => {},
    isBanner: false,
    isCommunityBanner: true,
  },
    { 
    title: "",
    subtitle: "",
    description: "",
    image: "/new90banner.jpg",
    overlay: "",
    buttonText: "",
    buttonAction: () => {},
    isBanner: true,
  },
     {
      title: "",
      subtitle: "",
      description: "",
      image: "/purple modern 11.11 50 discount instagram post (1024 x 768 mm)_20251203_215601_0000.jpg",
      overlay: "",
      buttonText: "",
      buttonAction: () => {},
      isBanner: true
    },
    {
      title: "🎮 PREMIUM GAMING 🎮",
      subtitle: "Best Games, Best Prices",
      description: "Experience the latest PS4 & PS5 titles at unbeatable prices",
      image: "https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      overlay: "bg-gradient-to-br from-violet-950/95 via-fuchsia-900/80 to-black/90",
      buttonText: "Shop Now",
      buttonAction: onShopBestsellers,
      isBanner: false
    },

  ];

  const renderSlideContent = (slide: any) => {
    if (slide.isBanner) {
      return null;
    }

    return (
      <div className="relative text-white w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
       <h1 className="animate-title-glow whitespace-nowrap text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-black mb-2 xs:mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight">
  {slide.title}
</h1>

        <div className="animate-strip-gradient-flow text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-3 xs:mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent text-center drop-shadow-lg">
          {slide.subtitle}
        </div>

        <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 xs:mb-6 sm:mb-8 md:mb-10 opacity-95 leading-relaxed text-center max-w-2xl mx-auto">
          {slide.description}
        </p>

        {/* Action Buttons */}
{slide.buttonText && (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 max-w-xs sm:max-w-sm md:max-w-lg mx-auto">
    <button
      onClick={slide.buttonAction}
      className="relative flex-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-full font-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3"
    >
      <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-40 pointer-events-none" />
      <Star className="relative w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
      <span className="relative truncate">{slide.buttonText}</span>
    </button>
    <button
      onClick={onBrowseCategories}
      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/50 hover:border-fuchsia-300 px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
    >
      Browse Categories
    </button>
  </div>
)}

      </div>
    );
  };

  return (
    <section className="relative h-64 xs:h-72 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] 2xl:h-[700px] overflow-hidden"
    onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
      >
      {slides.map((slide, index) => (

        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {(slide as any).isCommunityBanner ? (
            <div className="relative w-full h-full flex flex-col bg-[#0d0716]">
              <div className="relative flex-1 min-h-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt="Every Game, One Gaming Community"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {communityBannerGames.length > 0 && (
                <div className="relative flex-shrink-0 bg-gradient-to-b from-[#0d0716] to-black py-2 xs:py-2.5 sm:py-3 md:py-4 overflow-hidden">
                  <div className="flex w-max gap-2 xs:gap-3 sm:gap-4 animate-scroll-fast">
                    {[...communityBannerGames, ...communityBannerGames].map((game, i) => (
                      <button
                        key={`${game.id}-${i}`}
                        onClick={() => navigate(`/games/${game.id}`)}
                        className="group flex-shrink-0 w-14 xs:w-16 sm:w-20 md:w-24 aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden border-2 border-white/90 shadow-xl transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
                      >
                        <img
                          src={game.image}
                          alt={game.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (slide as any).isAnimatedBg ? (
            <AnimatedGamingBackground className="w-full h-full">
              <div className="relative w-full h-full flex items-center justify-center">
                {SPARKLE_POSITIONS.map((sparkle, i) => (
                  <Sparkles
                    key={i}
                    className={`hidden sm:block absolute ${sparkle.size} text-fuchsia-200 animate-sparkle-twinkle pointer-events-none`}
                    style={{ top: sparkle.top, left: sparkle.left, animationDelay: sparkle.delay }}
                  />
                ))}

                <div className="container mx-auto px-2 sm:px-3 md:px-4 h-full flex items-center justify-center">
                  {renderSlideContent(slide)}
                </div>
              </div>
            </AnimatedGamingBackground>
          ) : slide.isBanner ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
              {/* Blurred fill so the frame is never plain black, without cropping the real image */}
              <img
                src={slide.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
              />
              <img
                src={slide.image}
                alt="Banner"
                decoding="async"
                className="relative w-full h-full object-contain"
              />
            </div>
          ) : (
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={`relative w-full h-full ${slide.overlay} flex items-center justify-center`}>
                {/* Twinkling sparkle particles */}
                {SPARKLE_POSITIONS.map((sparkle, i) => (
                  <Sparkles
                    key={i}
                    className={`hidden sm:block absolute ${sparkle.size} text-fuchsia-200 animate-sparkle-twinkle pointer-events-none`}
                    style={{ top: sparkle.top, left: sparkle.left, animationDelay: sparkle.delay }}
                  />
                ))}

                <div className="container mx-auto px-2 sm:px-3 md:px-4 h-full flex items-center justify-center">
                  {renderSlideContent(slide)}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

   {/* Left Arrow */}
<button
  onClick={goToPrevSlide}
  className="group absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-amber-500/70 to-orange-600/70 hover:from-amber-400 hover:to-orange-500 backdrop-blur-md border border-amber-300/50 hover:border-white/60 text-white rounded-full p-1.5 sm:p-3 shadow-[0_0_15px_rgba(251,146,60,0.4)] hover:shadow-[0_0_25px_rgba(251,146,60,0.8)] transition-all duration-300 hover:scale-110 active:scale-95"
  aria-label="Previous Slide"
>
  <svg className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
</button>

{/* Right Arrow */}
<button
  onClick={goToNextSlide}
  className="group absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-amber-500/70 to-orange-600/70 hover:from-amber-400 hover:to-orange-500 backdrop-blur-md border border-amber-300/50 hover:border-white/60 text-white rounded-full p-1.5 sm:p-3 shadow-[0_0_15px_rgba(251,146,60,0.4)] hover:shadow-[0_0_25px_rgba(251,146,60,0.8)] transition-all duration-300 hover:scale-110 active:scale-95"
  aria-label="Next Slide"
>
  <svg className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
</button>


      {/* Slide-Specific Badges (hidden on mobile) */}
<div className="hidden sm:block">
  {/* Slide 3: Premium Gaming */}
  {currentSlide === 3 && (
    <>
      <div className="absolute top-2 sm:top-3 md:top-4 lg:top-6 xl:top-8 left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8">
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold shadow-lg animate-pulse">
          🕹 BEST GAMES
        </div>
      </div>
      <div className="absolute top-2 sm:top-3 md:top-4 lg:top-6 xl:top-8 right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold shadow-lg animate-bounce">
          💰 BEST PRICES
        </div>
      </div>
    </>
  )}
</div>


      {/* Slide Indicators */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 ${
          (slides[currentSlide] as any)?.isCommunityBanner
            ? 'bottom-20 xs:bottom-24 sm:bottom-28 md:bottom-32'
            : 'bottom-2 sm:bottom-4'
        }`}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-fuchsia-300 scale-125 shadow-[0_0_10px_rgba(232,121,249,0.9)]'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Floating elements for visual appeal */}
      <div className="absolute top-1/4 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 animate-loader-drift opacity-25 pointer-events-none">
        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-fuchsia-400 rounded-full blur-sm"></div>
      </div>
      <div
        className="absolute bottom-1/4 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 animate-loader-drift opacity-25 pointer-events-none"
        style={{ animationDelay: '2s' }}
      >
        <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-violet-400 rounded-full blur-sm"></div>
      </div>
      <div
        className="absolute top-1/2 right-1/3 animate-loader-drift opacity-20 pointer-events-none"
        style={{ animationDelay: '4s' }}
      >
        <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 bg-orange-400 rounded-full blur-sm"></div>
      </div>
    </section>
  );
};

export default Hero;
