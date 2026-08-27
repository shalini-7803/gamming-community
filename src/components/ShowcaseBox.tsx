import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LucideIcon, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Game, getStartingPrice } from "../config/supabase";
import Loader from "./Loader";

interface ShowcaseBoxProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  glowColor: string;
  accentText: string;
  buttonGradient: string;
  games: Game[];
  loading: boolean;
  viewAllPath: string;
  onGameClick: (game: Game) => void;
}

const ShowcaseBox: React.FC<ShowcaseBoxProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconBg,
  glowColor,
  accentText,
  buttonGradient,
  games,
  loading,
  viewAllPath,
  onGameClick,
}) => {
  const navigate = useNavigate();
  const items = games.slice(0, 8);
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    setCenterIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [items.length]);

  const goPrev = () =>
    setCenterIndex((prev) => (prev - 1 + items.length) % items.length);
  const goNext = () => setCenterIndex((prev) => (prev + 1) % items.length);

  const cardAt = (offset: number) =>
    items.length ? items[(centerIndex + offset + items.length) % items.length] : null;

  return (
    <div className="relative overflow-hidden bg-slate-900/70 light:bg-white backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/10 light:border-gray-200">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white light:text-gray-900 truncate">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 light:text-gray-500 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-6">
          <Loader size="small" message="Loading..." />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500 light:text-gray-500 text-center py-8">
          Nothing here yet — check back soon!
        </p>
      ) : (
        <div className="relative h-56 sm:h-64 mb-4 sm:mb-6 flex items-center justify-center">
          {/* Ambient glow behind the stack */}
          <div
            className={`absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full blur-3xl opacity-40 ${glowColor}`}
          />

          {/* Side peek card (previous) */}
          {items.length > 1 && cardAt(-1) && (
            <button
              onClick={goPrev}
              className="absolute left-1 sm:left-4 w-20 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden opacity-50 scale-90 -translate-x-2 sm:-translate-x-4 shadow-lg transition-all duration-300 hover:opacity-70"
              aria-label="Previous"
            >
              <img
                src={cardAt(-1)!.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          )}

          {/* Side peek card (next) */}
          {items.length > 1 && cardAt(1) && (
            <button
              onClick={goNext}
              className="absolute right-1 sm:right-4 w-20 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden opacity-50 scale-90 translate-x-2 sm:translate-x-4 shadow-lg transition-all duration-300 hover:opacity-70"
              aria-label="Next"
            >
              <img
                src={cardAt(1)!.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          )}

          {/* Center featured card */}
          {cardAt(0) && (
            <div
              onClick={() => onGameClick(cardAt(0)!)}
              className="group relative z-10 w-32 sm:w-40 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <img
                src={cardAt(0)!.image}
                alt={cardAt(0)!.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 sm:p-3">
                <p className="text-white text-[11px] sm:text-xs font-bold line-clamp-1">
                  {cardAt(0)!.title}
                </p>
                <span className={`text-xs sm:text-sm font-bold ${accentText}`}>
                  ₹{getStartingPrice(cardAt(0)!)}
                </span>
              </div>
            </div>
          )}

          {items.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                aria-label="Previous game"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                aria-label="Next game"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => navigate(viewAllPath)}
        className={`group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${buttonGradient} text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
      >
        View All
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default ShowcaseBox;
