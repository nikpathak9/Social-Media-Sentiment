import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";

const ScrollToTop: React.FC = () => {
  const { palette } = useDashboard();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-to-top ${!isVisible ? "hidden" : ""}`}
      onClick={scrollToTop}
      title='Scroll to top'
      aria-label='Scroll to top'
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "3rem",
        height: "3rem",
        background: palette.accent,
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease",
        zIndex: 1000,
        fontSize: "1.2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
