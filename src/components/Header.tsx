import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Shield,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGames, useSubscriptions } from "../hooks/useSupabaseData";
import {
  Game,
  getPlatformsForGame,
  getStartingPrice,
} from "../config/supabase";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onLoginClick: () => void;
  onCartClick: () => void;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  cartItemCount: number;
  onNavigation: (section: string) => void;
  user?: any;
  hasNewsletterDiscount?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onCartClick,
  isLoggedIn,
  isAdmin,
  cartItemCount,
  onNavigation,
  user,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Game[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  const { games } = useGames({ limit: 1000 });
  const { subscriptions } = useSubscriptions({ limit: 100 });

  const allItems = useMemo(
    () => [...(games || []), ...(subscriptions || [])],
    [games, subscriptions]
  );

  useEffect(() => {
    const state = location.state as { search?: string } | null;
    if (state?.search) {
      setSearchQuery(state.search);
    }
  }, [location.state]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      let filtered = allItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (platformFilter !== "all") {
        if (platformFilter === "subscription") {
          filtered = filtered.filter((item) => item.category === "subscription");
        } else {
          filtered = filtered.filter(
            (item) =>
              item.category === "game" &&
              getPlatformsForGame(item).includes(platformFilter)
          );
        }
      }

      setSearchSuggestions(filtered.slice(0, 15));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, platformFilter, allItems]);

  const displayName =
    user?.email?.split("@")[0] ||
    user?.name ||
    user?.full_name ||
    "User";

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (item: Game) => {
    setSearchQuery("");
    setShowSuggestions(false);
    setIsSearchExpanded(false);

    if (item.category === "game") {
      navigate(`/games/${item.id}`);
    } else {
      navigate(`/subscriptions/${item.id}`);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const trimmedSearch = searchQuery.trim();

    if (platformFilter === "subscription") {
      navigate("/subscriptions", { state: { search: trimmedSearch } });
    } else if (platformFilter === "PC") {
      // GamesPage/PCGamesPage read their initial search term from the URL
      // query string, not from navigate() state, so it must be passed here.
      navigate(`/pc-games?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      const params = new URLSearchParams({ search: trimmedSearch });
      if (platformFilter !== "all") params.set("platform", platformFilter);
      navigate(`/games?${params.toString()}`);
    }

    setIsSearchExpanded(false);
    setShowSuggestions(false);
  };

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Browse Games", id: "games" },
    { name: "Categories", id: "categories" },
    { name: "FAQ", id: "faq" },
    { name: "Refer & Earn", id: "refer" },
    { name: "Contact", id: "contact" },
  ];

  if (isAdmin) {
    navItems.push({ name: "Admin", id: "admin" });
  }

  const isNavActive = (itemId: string) => {
    if (itemId === "home") return location.pathname === "/";
    if (itemId === "games")
      return (
        location.pathname.startsWith("/games") ||
        location.pathname.startsWith("/pc-games")
      );
    if (itemId === "faq") return location.pathname === "/faq";
    if (itemId === "refer") return location.pathname === "/refer-and-earn";
    if (itemId === "admin") return location.pathname === "/admin";
    return false;
  };

  const handleNavClick = (itemId: string) => {
    if (itemId === "home") {
      navigate("/");
    } else if (itemId === "contact") {
      const phoneNumber = "919266514434";
      const message = "Hi! I need help with my gaming purchase.";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    } else if (itemId === "games") {
      navigate("/games");
    } else if (itemId === "refer") {
      navigate("/refer-and-earn");
    } else {
      onNavigation(itemId);
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="relative bg-gradient-to-b from-black via-slate-950 to-slate-900 shadow-[0_4px_30px_rgba(168,85,247,0.12)] border-b border-fuchsia-500/20">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-70" />
        {!isSearchExpanded ? (
          <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <img
                  src="https://i.ibb.co/Z6fBvJs7/IMG-20250814-112209-181.webp"
                  alt="Gaming Community"
                  className="h-10 xl:h-11 w-auto object-contain cursor-pointer rounded-lg"
                  onClick={() => navigate("/")}
                />

                <nav>
                  <ul className="flex items-center space-x-1">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavClick(item.id)}
                          className={`text-xs font-bold uppercase tracking-wide transition-all duration-300 py-2 px-3 rounded-md flex items-center space-x-1.5 ${
                            item.id === "admin"
                              ? "text-purple-300 hover:text-purple-200 bg-purple-500/10"
                              : isNavActive(item.id)
                              ? "text-fuchsia-400 bg-white/5 shadow-[0_0_12px_rgba(217,70,239,0.35)]"
                              : "text-slate-300 hover:text-fuchsia-400 hover:bg-white/5"
                          }`}
                        >
                          {item.id === "admin" && <Shield className="w-3.5 h-3.5" />}
                          <span>{item.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="flex items-center space-x-3">
                <ThemeToggle className="p-2.5" />

                <button
                  onClick={handleSearchClick}
                  className="text-slate-300 hover:text-fuchsia-400 hover:bg-white/5 transition-colors p-2.5 rounded-full"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-lime-500/10 rounded-full border border-lime-500/25">
                      <User className="w-4 h-4 text-lime-400" />
                      <span className="text-lime-300 font-medium text-sm">
                        {displayName}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigation("logout")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full border border-transparent text-red-400 hover:text-white hover:bg-red-500 transition-all duration-300 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onLoginClick}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/15 text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 hover:border-transparent transition-all duration-300 text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                )}

                <button
                  onClick={onCartClick}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-full border border-white/15 text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:border-transparent transition-all duration-300 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md ring-2 ring-slate-950">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:hidden relative">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-slate-300 hover:text-fuchsia-400 p-1.5 z-50 relative"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

                <img
                  src="https://i.ibb.co/Z6fBvJs7/IMG-20250814-112209-181.webp"
                  alt="Gaming Community"
                  className="h-8 xs:h-9 sm:h-10 w-auto object-contain cursor-pointer rounded-md"
                  onClick={() => navigate("/")}
                />

                <div className="flex items-center space-x-1">
                  <ThemeToggle className="p-1.5" />

                  <button
                    onClick={handleSearchClick}
                    className="text-slate-300 hover:text-fuchsia-400 p-1.5"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onCartClick}
                    className="relative text-slate-300 hover:text-fuchsia-400 p-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] ring-2 ring-slate-950">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-slate-950 light:bg-white shadow-lg border-t border-white/10 light:border-gray-200 z-50">
                  <div className="container mx-auto px-3 sm:px-4 py-4">
                    <nav className="space-y-1">
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`block w-full text-left py-3 px-3 transition-colors rounded-lg flex items-center space-x-2 text-sm font-semibold uppercase tracking-wide ${
                            item.id === "admin"
                              ? "text-purple-300 light:text-purple-800 bg-purple-500/10 border border-purple-500/25"
                              : isNavActive(item.id)
                              ? "text-fuchsia-400 bg-white/5"
                              : "text-slate-300 light:text-gray-700 hover:text-fuchsia-400 hover:bg-white/5 light:hover:bg-gray-100"
                          }`}
                        >
                          {item.id === "admin" && (
                            <Shield className="w-4 h-4" />
                          )}
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </nav>

                    {isLoggedIn ? (
                      <div className="mt-4 space-y-2">
                        <div className="py-3 px-3 text-lime-300 light:text-lime-800 bg-lime-500/10 rounded-lg flex items-center justify-between border border-lime-500/25">
                          <span>Welcome, {displayName}!</span>
                        </div>

                        <button
                          onClick={() => {
                            onNavigation("logout");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left py-3 px-3 text-red-400 hover:text-white transition-colors hover:bg-red-500 rounded-lg flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onLoginClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className="mt-4 w-full text-left py-3 px-3 text-slate-200 light:text-gray-700 hover:text-white transition-all hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 rounded-lg border border-white/15 light:border-gray-300"
                      >
                        Admin Login
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-1 sm:gap-4">
              <button
                onClick={handleSearchClose}
                className="text-slate-300 hover:text-fuchsia-400 transition-colors p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="w-3/8 sm:w-1/6">
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-fuchsia-400 rounded-full focus:outline-none focus:border-violet-500 transition-colors text-sm sm:text-base bg-white"
                >
                  <option value="all">All</option>
                  <option value="PS5">PS5</option>
                  <option value="PS4">PS4</option>
                  <option value="PSVR2">PSVR2</option>
                  <option value="PC">PC</option>
                  <option value="Xbox">Xbox</option>
                  <option value="subscription">Subs</option>
                </select>
              </div>

              <div className="relative flex-1 w-full sm:flex-1">
                <input
                  type="text"
                  placeholder="Search for games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-8 pr-4 py-2 border-2 border-fuchsia-400 rounded-full focus:outline-none focus:border-violet-500 transition-colors text-sm sm:text-lg"
                  autoFocus
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    title="Clear search"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-fuchsia-500 hover:text-fuchsia-600 transition-colors z-10"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-fuchsia-500 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                )}

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-64 overflow-y-auto">
                    {searchSuggestions.map((item) => {
                      const platforms = getPlatformsForGame(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
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

              <div className="w-auto">
                <button
                  onClick={handleSearch}
                  className="bg-fuchsia-500 hover:bg-violet-600 text-white px-4 sm:px-6 py-2 rounded-full font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  <Search className="w-3 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="relative bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-700 text-white py-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        <div className="relative container mx-auto px-3 sm:px-4 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-lime-300" />
          <p className="text-xs sm:text-sm md:text-base font-medium tracking-wide">
            Trusted by Top Streamers and Gamers – Shop the Same Games They
            Play!
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;