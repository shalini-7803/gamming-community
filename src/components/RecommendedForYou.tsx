import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useRecommended } from "../hooks/useSupabaseData";
import {
  Game,
  getPlatformsForGame,
  getStartingPrice,
} from "../config/supabase";

interface RecommendedForYouProps {
  onGameClick: (game: Game) => void;
}

const RecommendedForYou: React.FC<RecommendedForYouProps> = ({ onGameClick }) => {
  const navigate = useNavigate();
  const { recommended, loading, error } = useRecommended(27);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const getItemsPerSlide = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
      setCurrentSlide(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(recommended.length / itemsPerSlide));

  useEffect(() => {
    if (!isAutoPlaying || recommended.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(interval);
  }, [recommended.length, isAutoPlaying, totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentSlide(index);

  // Nothing to recommend yet, or still loading/errored — stay out of the way
  // rather than showing an empty/loading section on the homepage.
  if (loading || error || recommended.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-orange-50 light:to-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300 light:from-orange-700 light:via-amber-700 light:to-yellow-700 bg-clip-text text-transparent">
              Recommended For You
            </h2>
          </div>
          <p className="text-slate-400 light:text-gray-500 text-base sm:text-lg px-4">
            Hand-picked by our team — don't miss these
          </p>
        </div>

        <div className="relative">
          <div
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div
                    className={`grid gap-3 sm:gap-4 md:gap-6 ${
                      itemsPerSlide === 1
                        ? "grid-cols-1"
                        : itemsPerSlide === 2
                          ? "grid-cols-2"
                          : "grid-cols-3"
                    }`}
                  >
                    {recommended
                      .slice(
                        slideIndex * itemsPerSlide,
                        (slideIndex + 1) * itemsPerSlide
                      )
                      .map((game) => {
                        const displayPrice = getStartingPrice(game);
                        const platforms = getPlatformsForGame(game);

                        return (
                          <div
                            key={game.id}
                            className="bg-slate-900/70 light:bg-white backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/10 light:border-gray-200 overflow-hidden hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-3 group cursor-pointer"
                            onClick={() => onGameClick(game)}
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={game.image}
                                alt={game.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Recommended
                              </div>
                              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg max-w-[45%] truncate">
                                {game.category === "game"
                                  ? platforms.join(", ")
                                  : "Subscription"}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-3 sm:p-4 md:p-6">
                              <h3 className="font-bold text-white light:text-gray-900 text-sm sm:text-base md:text-lg mb-2 sm:mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                                {game.title}
                              </h3>

                              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                                <div>
                                  <div className="text-xs text-slate-500 light:text-gray-500 mb-1">
                                    Starting from
                                  </div>
                                  <span className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                    ₹{displayPrice}
                                  </span>
                                </div>
                              </div>

                              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span>Select Options</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-slate-900/90 light:bg-white hover:bg-slate-800 light:hover:bg-gray-100 border border-white/10 light:border-gray-200 text-white light:text-gray-900 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-slate-900/90 light:bg-white hover:bg-slate-800 light:hover:bg-gray-100 border border-white/10 light:border-gray-200 text-white light:text-gray-900 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}

          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-orange-500 scale-125"
                      : "bg-white/20 light:bg-gray-300 hover:bg-white/40 light:hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <button
            onClick={() => navigate("/games")}
            className="bg-transparent border-2 border-orange-500 text-orange-400 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white hover:border-transparent px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(251,146,60,0.4)] transform hover:scale-105"
          >
            View All Games
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYou;
