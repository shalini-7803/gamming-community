import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, Filter, Grid, List } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscriptions } from "../hooks/useSupabaseData";
import { Game, getStartingPrice } from "../config/supabase";
import Loader from "../components/Loader";
import Pagination from "../components/ui/Pagination";

interface RestoredSubscriptionsState {
  page?: number;
  search?: string;
  priceRange?: [number, number];
  sort?: string;
  view?: "grid" | "list";
}

const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const restoredState = location.state as RestoredSubscriptionsState | null;

  const [searchQuery, setSearchQuery] = useState(restoredState?.search || "");
  const [tempSearchQuery, setTempSearchQuery] = useState(restoredState?.search || "");
  const [priceRange, setPriceRange] = useState<[number, number]>(
    restoredState?.priceRange || [0, 10000]
  );
  const [sortBy, setSortBy] = useState(restoredState?.sort || "name-asc");
  const [currentPage, setCurrentPage] = useState(restoredState?.page || 1);
  const [viewMode, setViewMode] = useState<"grid" | "list">(restoredState?.view || "grid");
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  const { subscriptions = [], totalCount, totalPages, loading, error } =
    useSubscriptions({
      searchQuery,
      priceRange,
      sortBy,
      page: currentPage,
      limit: itemsPerPage,
    });

  const skipNextPageReset = useRef(true);
  useEffect(() => {
    if (skipNextPageReset.current) {
      skipNextPageReset.current = false;
      return;
    }
    setCurrentPage(1);
  }, [searchQuery, priceRange, sortBy]);

  useEffect(() => {
    if (loading) return;

    const key = `subs-scroll:${window.location.pathname}${window.location.search}:${currentPage}`;
    const savedScrollY = sessionStorage.getItem(key);

    if (savedScrollY) {
      sessionStorage.removeItem(key);
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number(savedScrollY), behavior: "auto" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 const handleSubscriptionClick = (subscription: Game) => {
  sessionStorage.setItem(
    `subs-scroll:${window.location.pathname}${window.location.search}:${currentPage}`,
    String(window.scrollY)
  );

  navigate(`/subscriptions/${subscription.id}`, {
    state: {
      page: currentPage,
      search: searchQuery,
      priceRange,
      sort: sortBy,
      view: viewMode,
    },
  });
};

  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, totalCount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-1 sm:space-x-2 text-fuchsia-400 hover:text-orange-400 transition-colors bg-white/5 border border-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-lg text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 light:from-violet-700 light:via-fuchsia-700 light:to-orange-700 bg-clip-text text-transparent">
                Subscriptions
              </h1>
            </div>
          </div>
          <Loader
            size="large"
            message="Loading premium subscriptions..."
            fullScreen={false}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-1 sm:space-x-2 text-fuchsia-400 hover:text-orange-400 transition-colors bg-white/5 border border-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-lg text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 light:from-violet-700 light:via-fuchsia-700 light:to-orange-700 bg-clip-text text-transparent">
                Subscriptions
              </h1>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-red-400">
              Failed to load subscriptions. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-1 sm:space-x-2 text-fuchsia-400 hover:text-orange-400 transition-colors bg-white/5 border border-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-lg text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 light:from-violet-700 light:via-fuchsia-700 light:to-orange-700 bg-clip-text text-transparent">
              Subscriptions
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 text-slate-300 hover:text-fuchsia-400 transition-colors bg-white/5 border border-white/10 backdrop-blur-sm rounded-full shadow-lg"
            >
              {viewMode === "grid" ? (
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 sm:px-4 py-2 rounded-full hover:from-violet-600 hover:to-fuchsia-600 transition-colors shadow-lg text-sm sm:text-base"
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <div
            className={`lg:block ${
              showFilters ? "block" : "hidden"
            } space-y-4 sm:space-y-6`}
          >
            <div className="bg-slate-900/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/10">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
                Filters
              </h3>

              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Search Subscriptions
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search subscriptions..."
                      value={tempSearchQuery}
                      onChange={(e) => setTempSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSearchQuery(tempSearchQuery);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-white/10 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <button
                    onClick={() => setSearchQuery(tempSearchQuery)}
                    className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        Math.min(Number(e.target.value), priceRange[1]),
                        priceRange[1],
                      ])
                    }
                    className="w-full accent-fuchsia-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Math.max(Number(e.target.value), priceRange[0]),
                      ])
                    }
                    className="w-full accent-fuchsia-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-sm"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p className="text-slate-400 text-sm sm:text-base">
                Showing {showingFrom}-{showingTo} of {totalCount} subscriptions
              </p>
            </div>

            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">
                  No subscriptions found matching your criteria.
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="bg-slate-900/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.2)] transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-3 cursor-pointer group"
                    onClick={() => handleSubscriptionClick(subscription)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={subscription.image}
                        alt={subscription.title}
                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium shadow-lg">
                        Subscription
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-white text-xs sm:text-sm mb-2 line-clamp-2 group-hover:text-fuchsia-400 transition-colors">
                        {subscription.title}
                      </h3>
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                        <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                          ₹{getStartingPrice(subscription)}
                        </span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Select Options
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="bg-slate-900/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:border-fuchsia-500/40 hover:shadow-[0_0_25px_rgba(217,70,239,0.2)] transition-all duration-300 cursor-pointer"
                    onClick={() => handleSubscriptionClick(subscription)}
                  >
                    <div className="flex items-center p-4 sm:p-6">
                      <img
                        src={subscription.image}
                        alt={subscription.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg mr-4 sm:mr-6"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <h3 className="font-bold text-white text-sm sm:text-lg mb-1 sm:mb-2">
                              {subscription.title}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm mb-2 line-clamp-2 hidden sm:block">
                              {subscription.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-2 py-1 rounded text-xs font-medium">
                                Subscription
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                ₹{getStartingPrice(subscription)}
                              </span>
                            </div>
                            <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white py-2 px-4 sm:px-6 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                              Select Options
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;