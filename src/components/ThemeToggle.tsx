import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`inline-flex items-center justify-center rounded-full border border-white/20 light:border-gray-300 bg-white/10 light:bg-gray-100 hover:bg-white/20 light:hover:bg-gray-200 text-white light:text-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden ${className}`}
    >
      <span
        className={`inline-flex transition-transform duration-500 ease-out ${
          isLight ? "rotate-[360deg]" : "rotate-0"
        }`}
      >
        {isLight ? (
          <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
