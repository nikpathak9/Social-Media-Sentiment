import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { MoonStar, SunMedium } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, palette } = useDashboard();
  const [animating, setAnimating] = useState(false);

  const handleToggle = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        padding: "8px 12px",
        background: theme === "dark" ? "#F7F3E3" : "#2D3047",
        color: theme === "dark" ? "#2D3047" : "#F7F3E3",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.85rem",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
      aria-label='Toggle theme'
      className='flex items-center gap-2 transition-colors duration-300  ease-in-out'
    >
      <span
        className={animating ? "theme-toggle-anim" : ""}
        style={{
          fontSize: "0.9rem",
          display: "inline-flex",
          willChange: "transform, opacity",
        }}
      >
        {theme === "light" ? <MoonStar /> : <SunMedium />}
      </span>
      {theme === "light" ? "Dark" : "Light"}
      <style>{`
        .theme-toggle-anim {
          animation: theme-toggle-spin 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backface-visibility: hidden;
        }
        @keyframes theme-toggle-spin {
          0% {
        opacity: 1;
        transform: rotate(0deg) scale(1);
          }
          50% {
        opacity: 0.7;
        transform: rotate(180deg) scale(1.15);
          }
          100% {
        opacity: 1;
        transform: rotate(360deg) scale(1);
          }
        }
      `}</style>
    </button>
  );
};

export default ThemeToggle;
