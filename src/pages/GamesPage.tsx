import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Grid, List, Gamepad2, Flame, Sparkles } from "lucide-react";
import { useGames, useAllGames } from "../hooks/useSupabaseData";
import {
  Game,
  getPlatformsForGame,
  getStartingPrice,
} from "../config/supabase";
import Loader from "../components/Loader";
import Pagination from "../components/ui/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const priceOptions: { value: string; label: string; range?: [number, number] }[] = [
  { value: "all", label: "All Prices" },
  { value: "100-300", label: "₹100 - ₹300", range: [100, 300] },
  { value: "300-500", label: "₹300 - ₹500", range: [300, 500] },
  { value: "500+", label: "₹500 & Above", range: [500, 999999] },
];

interface GamesPageProps {
  /** When set, the platform filter is locked to this value (used for the /pc-games route). */
  lockedPlatform?: string;
  /** When set, only admin-flagged games are shown (used by /best-sellers and /recommended). */
  showcase?: "bestsellers" | "recommended";
}

const SHOWCASE_COPY = {
  bestsellers: {
    title: "Best Selling Games",
    subtitle: "Our most popular titles, loved by the community",
    icon: Flame,
    iconBg: "from-orange-500 to-red-500",
    emptyMessage: "No bestsellers marked yet. Check back soon!",
  },
  recommended: {
    title: "Recommended For You",
    subtitle: "Hand-picked by our team — don't miss these",
    icon: Sparkles,
    iconBg: "from-orange-500 to-amber-500",
    emptyMessage: "No recommendations marked yet. Check back soon!",
  },
} as const;

const GamesPage: React.FC<GamesPageProps> = ({ lockedPlatform, showcase }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const platformOptions = lockedPlatform
    ? [lockedPlatform]
    : ["all", "PS5", "PS4", "PSVR2", "Xbox", "PC"];

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedPlatform, setSelectedPlatform] = useState(
    lockedPlatform || searchParams.get("platform") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [selectedPriceRange, setSelectedPriceRange] = useState(
    searchParams.get("price") || "all"
  );

  const [tempSearchQuery, setTempSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [searchSuggestions, setSearchSuggestions] = useState<Game[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { allGames: catalogGames } = useAllGames();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (selectedPlatform !== "all") params.set("platform", selectedPlatform);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (selectedPriceRange !== "all") params.set("price", selectedPriceRange);
    if (currentPage > 1) params.set("page", String(currentPage));
    if (viewMode !== "grid") params.set("view", viewMode);

    const nextParams = params.toString();
    const currentParams = searchParams.toString();

    if (nextParams !== currentParams) {
      setSearchParams(params, { replace: true });
    }
  }, [
    searchQuery,
    selectedPlatform,
    sortBy,
    selectedPriceRange,
    currentPage,
    viewMode,
    searchParams,
    setSearchParams,
  ]);

  const filters = useMemo(
    () => ({
      searchQuery,
      platform: selectedPlatform,
      priceRange: priceOptions.find((option) => option.value === selectedPriceRange)
        ?.range,
      sortBy,
      page: currentPage,
      limit: 24,
      showcase,
    }),
    [searchQuery, selectedPlatform, selectedPriceRange, sortBy, currentPage, showcase]
  );

  const { games, totalCount, totalPages, loading, error } = useGames(filters);

  useEffect(() => {
    const query = tempSearchQuery.trim().toLowerCase();
    if (query.length === 0) {
      setSearchSuggestions([]);
      return;
    }

    setSearchSuggestions(
      (catalogGames || [])
        .filter((game) => game.title.toLowerCase().includes(query))
        .slice(0, 8)
    );
  }, [tempSearchQuery, catalogGames]);

  const handleSuggestionClick = (game: Game) => {
    setTempSearchQuery("");
    setSearchSuggestions([]);
    setIsSearchFocused(false);
    handleProductClick(game);
  };

 const handleProductClick = (game: Game) => {
  sessionStorage.setItem(
    `games-scroll:${window.location.pathname}${window.location.search}`,
    String(window.scrollY)
  );

  navigate(`/games/${game.id}`, {
    state: {
      page: currentPage,
      search: searchQuery,
      platform: selectedPlatform,
      sort: sortBy,
      view: viewMode,
    },
  });
};

  useEffect(() => {
    if (loading) return;

    const key = `games-scroll:${window.location.pathname}${window.location.search}`;
    const savedScrollY = sessionStorage.getItem(key);

    if (savedScrollY) {
      sessionStorage.removeItem(key);
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number(savedScrollY), behavior: "auto" });
      });
    }
  }, [loading]);

  const applyFilters = () => {
    setSearchQuery(tempSearchQuery);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setTempSearchQuery("");

    setSearchQuery("");
    setSelectedPlatform(lockedPlatform || "all");
    setSortBy("newest");
    setSelectedPriceRange("all");
    setCurrentPage(1);
  };

  const renderPlatformBadges = (game: Game) => {
    const platforms = getPlatformsForGame(game);

    if (platforms.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {platforms.slice(0, 3).map((platform) => (
          <span
            key={platform}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium"
          >
            {platform}
          </span>
        ))}
        {platforms.length > 3 && (
          <span className="bg-white/10 text-slate-300 light:bg-white light:shadow-md light:border light:border-gray-200 light:text-gray-700 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium">
            +{platforms.length - 3}
          </span>
        )}
      </div>
    );
  };

  const renderGameCard = (game: Game) => {
    const startingPrice = getStartingPrice(game);

    return (
      <div
        key={game.id}
        onClick={() => handleProductClick(game)}
        className="group bg-slate-900/70 light:bg-gray-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 light:border-gray-200 overflow-hidden hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.2)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <img
            src={game.image}
            alt={game.title}
            loading="lazy"
            decoding="async"
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {game.edition && game.edition !== "Standard" && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              {game.edition}
            </div>
          )}
          {showcase === "bestsellers" ? (
            game.is_recommended && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                Recommended
              </div>
            )
          ) : (
            game.show_in_bestsellers && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                Bestseller
              </div>
            )
          )}
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-white light:text-gray-900 text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-fuchsia-400 transition-colors">
            {game.title}
          </h3>

          {renderPlatformBadges(game)}

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 light:text-gray-500">Starting from</p>
              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                ₹{startingPrice}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(game);
              }}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md"
            >
              View
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGameListItem = (game: Game) => {
    const startingPrice = getStartingPrice(game);

    return (
      <div
        key={game.id}
        onClick={() => handleProductClick(game)}
        className="group bg-slate-900/70 light:bg-gray-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 light:border-gray-200 overflow-hidden hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.2)] transition-all duration-300 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 lg:w-56 flex-shrink-0 relative overflow-hidden">
            <img
              src={game.image}
              alt={game.title}
              loading="lazy"
              decoding="async"
              className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {game.edition && game.edition !== "Standard" && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                {game.edition}
              </div>
            )}
          </div>

          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white light:text-gray-900 text-lg sm:text-xl mb-2 group-hover:text-fuchsia-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-slate-400 light:text-gray-500 text-sm sm:text-base line-clamp-3">
                    {game.description}
                  </p>
                </div>
              </div>

              {renderPlatformBadges(game)}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 light:text-gray-500">Starting from</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  ₹{startingPrice}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(game);
                }}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md"
              >
                View Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-blue-50 light:to-orange-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Loader
            size="large"
            message="Loading games..."
            fullScreen={false}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-blue-50 light:to-orange-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-slate-900/70 light:bg-gray-50 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/10 light:border-gray-200">
            <h2 className="text-2xl font-bold text-white light:text-gray-900 mb-4">
              Failed to load games
            </h2>
            <p className="text-slate-400 light:text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-blue-50 light:to-orange-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-slate-900/70 light:bg-gray-50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 light:border-gray-200 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${
                showcase ? SHOWCASE_COPY[showcase].iconBg : "from-violet-500 to-fuchsia-500"
              } rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)]`}
            >
              {showcase ? (
                React.createElement(SHOWCASE_COPY[showcase].icon, {
                  className: "w-6 h-6 text-white",
                })
              ) : (
                <Gamepad2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 light:from-violet-700 light:via-fuchsia-700 light:to-orange-700 bg-clip-text text-transparent">
                {showcase ? SHOWCASE_COPY[showcase].title : "Games Collection"}
              </h1>
              <p className="text-slate-400 light:text-gray-500 text-sm sm:text-base">
                {showcase ? SHOWCASE_COPY[showcase].subtitle : "Explore our gaming library"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 light:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for games..."
                value={tempSearchQuery}
                onChange={(e) => {
                  setTempSearchQuery(e.target.value);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchSuggestions([]);
                    applyFilters();
                  }
                }}
                className="w-full pl-12 pr-32 py-3 rounded-2xl border border-white/10 light:border-gray-300 bg-slate-800 light:bg-white text-white light:text-gray-900 placeholder-slate-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
              <button
                onClick={applyFilters}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md"
              >
                Search
              </button>

              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-30 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((item) => {
                    const platforms = getPlatformsForGame(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={() => handleSuggestionClick(item)}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 truncate">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            ₹{getStartingPrice(item)} •{" "}
                            {item.category === "subscription"
                              ? "Subscription"
                              : platforms.join(", ")}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="lg:hidden border border-white/10 light:border-gray-200 px-4 py-3 rounded-2xl flex items-center gap-2 text-slate-300 light:text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 hover:border-transparent transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="flex bg-slate-800 light:bg-white border border-white/10 light:border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                      : "text-slate-400 light:text-gray-500"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                      : "text-slate-400 light:text-gray-500"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block mt-6 pt-6 border-t border-white/10 light:border-gray-200`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 light:text-gray-500 mb-2">
                  Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => {
                    setSelectedPlatform(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 light:border-gray-300 bg-slate-800 light:bg-white text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  {platformOptions.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform === "all" ? "All Platforms" : platform}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 light:text-gray-500 mb-2">
                  Rent Price
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => {
                    setSelectedPriceRange(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 light:border-gray-300 bg-slate-800 light:bg-white text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  {priceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 light:text-gray-500 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 light:border-gray-300 bg-slate-800 light:bg-white text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-slate-400 light:text-gray-500 lg:text-center">
                <span className="font-bold text-fuchsia-300 light:text-fuchsia-800 bg-fuchsia-500/10 px-2.5 py-1 rounded-full">
                  {totalCount}
                </span>{" "}
                game{totalCount !== 1 ? "s" : ""} found
              </div>

              <div className="lg:text-right">
                <button
                  onClick={resetFilters}
                  className="w-full lg:w-auto border border-white/10 light:border-gray-200 text-slate-300 light:text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 hover:border-transparent px-5 py-3 rounded-2xl font-medium transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="bg-slate-900/70 light:bg-gray-50 backdrop-blur-sm rounded-3xl p-10 text-center shadow-xl border border-white/10 light:border-gray-200">
            <h2 className="text-2xl font-bold text-white light:text-gray-900 mb-3">
              No games found
            </h2>
            <p className="text-slate-400 light:text-gray-500 mb-6">
              {showcase
                ? SHOWCASE_COPY[showcase].emptyMessage
                : "Try changing your search or filter options."}
            </p>
            <button
              onClick={resetFilters}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {games.map((game) => renderGameCard(game))}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {games.map((game) => renderGameListItem(game))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GamesPage;