import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import TrustIndicators from '../components/TrustIndicators';
import Vouches from '../components/Vouches';
import BestSellers from '../components/BestSellers';
import Categories from '../components/Categories';
import ReviewsSection from '../components/ReviewsSection';
import Loader from '../components/Loader';
import { Game } from '../config/supabase';

interface HomePageProps {
  onNavigation: (section: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigation }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading for home page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loader for 1.5 seconds on initial load

    return () => clearTimeout(timer);
  }, []);

  const handleGameClick = (game: Game) => {
    if (game.category === 'game') {
      navigate(`/games/${game.id}`);
    } else {
      navigate(`/subscriptions/${game.id}`);
    }
  };

  const handleViewAllGames = () => {
    navigate('/games');
  };

  const handleViewSubscriptions = () => {
    navigate('/subscriptions');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <Loader size="large" message="Welcome to Gaming Community!" fullScreen={true} />;
  }

  return (
    <>
      <Hero
        onShopBestsellers={() => scrollToSection('bestsellers')}
        onBrowseCategories={() => scrollToSection('categories')}
      />

      {/* WhatsApp Community + Channel CTA */}
      <section className="px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-black light:bg-gradient-to-br light:from-slate-50 light:via-blue-50 light:to-orange-50 px-4 py-4 sm:px-6 sm:py-5 text-white light:text-gray-900 shadow-xl">

            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-orange-500/25 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-center sm:text-left">
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 light:border-orange-300 bg-orange-500/10 light:bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-200 light:text-orange-800">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
                    </span>
                    Exclusive discounts
                  </span>

                  <span className="rounded-full border border-white/10 light:border-gray-200 bg-white/10 light:bg-white light:shadow-md px-2.5 py-0.5 text-[11px] font-semibold text-white light:text-gray-900">
                    2500+ members
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Join our Gaming Community
                </h3>

                <p className="mt-1 text-xs sm:text-sm text-gray-300 light:text-gray-700">
                  Early updates on new games, rental offers &amp; community-only deals.
                </p>
              </div>

              <div className="flex flex-col xs:flex-row items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0">
                <a
                  href="https://chat.whatsapp.com/Ji2m3HfTatXFc2q9eYabA1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full xs:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-orange-500/40 active:scale-95"
                >
                  Join Community
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>

                <a
                  href="https://whatsapp.com/channel/0029Vaz3HzXBadmdfwWvXQ1A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full xs:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 light:border-gray-200 bg-white/10 light:bg-white light:shadow-md px-4 py-2 text-sm font-bold text-white light:text-gray-900 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/15 light:hover:bg-gray-100 active:scale-95"
                >
                  Join Channel
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustIndicators />

      <Vouches />

       <div id="categories">
        <Categories onViewAllGames={handleViewAllGames} onViewSubscriptions={handleViewSubscriptions} />
      </div> 
      <div id="bestsellers">
        <BestSellers onGameClick={handleGameClick} />
      </div>
      <div className='z-[9999]'>
        <ReviewsSection />
        </div>
      


     
    </>
  );
};

export default HomePage;