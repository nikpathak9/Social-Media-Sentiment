export interface Comment {
  id: string;
  text: string;
  timestamp: Date;
  sentiment: "positive" | "neutral" | "negative";
  reactions: string[];
  user: string;
}

export interface Topic {
  text: string;
  value: number;
  sentiment?: "positive" | "neutral" | "negative";
  sentimentStrength?: number;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export interface ThemePalette {
  background: string;
  card: string;
  border: string;
  text: string;
  subtext: string;
  accent: string;
  header: string;
  shadow: string;
  panelShadow: string;
  separator: string;
  sentiment: {
    positive: string;
    neutral: string;
    negative: string;
  };
  sentimentSecondary: {
    positive: string;
    neutral: string;
    negative: string;
  };
  emojiBtn: string;
  emojiBtnActive: string;
  emojiBtnBorder: string;
}

export type ThemeType = "light" | "dark";
export type SortType = "recent" | "liked" | "sentiment";
export type SentimentFilterType = "all" | "positive" | "neutral" | "negative";
export type ExportType = "full" | "filtered" | "summary";