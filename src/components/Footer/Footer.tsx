import React from "react";
import { useDashboard } from "../../context/DashboardContext";

const Footer: React.FC = () => {
  const { theme, palette } = useDashboard();

  return (
    <footer
      style={{
        width: "100%",
        background: theme === "dark" ? palette.header : palette.card,
        color: palette.subtext,
        borderTop: `1px solid ${palette.border}`,
        textAlign: "center",
        padding: "1.2rem 0 1.2rem 0",
        fontSize: "0.98rem",
        fontWeight: 500,
        marginTop: "auto",
        zIndex: 1,
      }}
    >
      <span style={{ color: palette.text, fontWeight: 600 }}>
        © {new Date().getFullYear()} Social Media Sentiment Dashboard
      </span>
    </footer>
  );
};

export default Footer;
