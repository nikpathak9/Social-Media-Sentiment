import type { ThemePalette, ThemeType } from "../types";

export const getThemePalette = (theme: ThemeType): ThemePalette => {
  return theme === "dark"
    ? {
        background: "#181c23",
        card: "#232936",
        border: "#3a4252",
        text: "#e6eaf3",
        subtext: "#b0b8c9",
        accent: "#4f8cff",
        header: "#232936",
        shadow: "0 4px 12px rgba(0,0,0,0.35)",
        panelShadow: "0 8px 24px rgba(0,0,0,0.4)",
        separator:
          "linear-gradient(90deg, transparent, rgba(79,140,255,0.3), transparent)",
        sentiment: {
          positive: "#4ade80",
          neutral: "#94a3b8",
          negative: "#f87171",
        },
        sentimentSecondary: {
          positive: "#22c55e",
          neutral: "#64748b",
          negative: "#ef4444",
        },
        emojiBtn: "#232936",
        emojiBtnActive: "#4f8cff",
        emojiBtnBorder: "#3a4252",
      }
    : {
        background: "#f8fafc",
        card: "#ffffff",
        border: "#e2e8f0",
        text: "#1e293b",
        subtext: "#64748b",
        accent: "#3b82f6",
        header: "#ffffff",
        shadow: "0 4px 12px rgba(0,0,0,0.08)",
        panelShadow: "0 8px 24px rgba(0,0,0,0.12)",
        separator:
          "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)",
        sentiment: {
          positive: "#10b981",
          neutral: "#6b7280",
          negative: "#f59e0b",
        },
        sentimentSecondary: {
          positive: "#059669",
          neutral: "#4b5563",
          negative: "#d97706",
        },
        emojiBtn: "#ffffff",
        emojiBtnActive: "#dbeafe",
        emojiBtnBorder: "#e2e8f0",
      };
};
