import React from "react";
import { useNavigate } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Game, getPlatformsForGame, getStartingPrice } from "../config/supabase";
import Loader from "./Loader";

interface ShowcaseBoxProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
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
  accentText,
  buttonGradient,
  games,
  loading,
  viewAllPath,
  onGameClick,
}) => {
  const navigate = useNavigate();
  const preview = games.slice(0, 4);

  return (
    <div className="bg-slate-900/70 light:bg-white backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/10 light:border-gray-200">
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
      ) : preview.length === 0 ? (
        <p className="text-sm text-slate-500 light:text-gray-500 text-center py-8">
          Nothing here yet — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {preview.map((game) => {
            const platforms = getPlatformsForGame(game);
            return (
              <div
                key={game.id}
                onClick={() => onGameClick(game)}
                className="group cursor-pointer bg-white/5 light:bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden border border-white/10 light:border-gray-200 hover:border-fuchsia-500/40 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-white light:text-gray-900 line-clamp-1 mb-1">
                    {game.title}
                  </h3>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] sm:text-xs text-slate-500 light:text-gray-500 truncate">
                      {game.category === "game" ? platforms[0] || "" : "Sub"}
                    </span>
                    <span className={`text-xs sm:text-sm font-bold ${accentText}`}>
                      ₹{getStartingPrice(game)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
