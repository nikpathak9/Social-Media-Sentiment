import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Comment,
  ThemeType,
  SortType,
  SentimentFilterType,
  ThemePalette,
} from "../types";
import { generateMockComment } from "../utils/mockData";
import { getThemePalette } from "../utils/theme";

interface DashboardContextType {
  // Comments
  allComments: Comment[];
  filteredComments: Comment[];

  // Time filters
  startTime: Date;
  endTime: Date;
  setStartTime: (date: Date) => void;
  setEndTime: (date: Date) => void;

  // Emoji filters
  selectedEmojis: string[];
  handleEmojiFilterChange: (emoji: string) => void;

  // Sort and filters
  sortBy: SortType;
  sentimentFilter: SentimentFilterType;
  setSortBy: (sort: SortType) => void;
  setSentimentFilter: (filter: SentimentFilterType) => void;

  // Theme
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  palette: ThemePalette;

  // UI state
  lastUpdate: Date;
  now: Date;
  dataUpdateIndicator: boolean;

  // Export functionality
  handleCsvExport: (exportType: "full" | "filtered" | "summary") => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [allComments, setAllComments] = useState<Comment[]>(() =>
    Array.from({ length: 80 }, generateMockComment).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )
  );
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);

  const [startTime, setStartTime] = useState<Date>(
    () => new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  );
  const [endTime, setEndTime] = useState<Date>(() => new Date());

  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("recent");
  const [sentimentFilter, setSentimentFilter] =
    useState<SentimentFilterType>("all");

  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [now, setNow] = useState<Date>(new Date());
  const [dataUpdateIndicator, setDataUpdateIndicator] = useState(false);

  const palette = getThemePalette(theme);

  // Update document theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "Social Sentiment Dashboard";
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Generate new comments periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAllComments((prevComments) => {
        const newCommentsBatch = Array.from(
          { length: Math.ceil(Math.random() * 4) + 1 },
          generateMockComment
        );
        newCommentsBatch.forEach((c, index) => {
          c.timestamp = new Date(Date.now() - index * 1000);
        });
        const updatedComments = [...newCommentsBatch, ...prevComments].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
        return updatedComments.slice(0, 500);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Filter comments by date range
  useEffect(() => {
    const commentsInDateRange = allComments.filter(
      (comment) =>
        comment.timestamp >= startTime && comment.timestamp <= endTime
    );
    setFilteredComments(commentsInDateRange);
  }, [allComments, startTime, endTime]);

  // Update time periodically
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update last update indicator
  useEffect(() => {
    setLastUpdate(new Date());
    setDataUpdateIndicator(true);
    const timer = setTimeout(() => setDataUpdateIndicator(false), 2000);
    return () => clearTimeout(timer);
  }, [allComments]);

  // Update end time when new comments arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      setEndTime(new Date());
    }, 100);

    return () => clearTimeout(timer);
  }, [allComments.length]);

  const handleEmojiFilterChange = (emoji: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const formatDateForInput = (date: Date): string => {
    if (isNaN(date.getTime())) {
      date = new Date();
    }
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleCsvExport = (
    exportType: "full" | "filtered" | "summary" = "filtered"
  ) => {
    let csvString = "";
    let filename = "";

    if (exportType === "summary") {
      const totalComments = filteredComments.length;
      const sentiments = { positive: 0, negative: 0, neutral: 0 };

      filteredComments.forEach((comment) => {
        sentiments[comment.sentiment]++;
      });

      const summaryData = [
        ["Metric", "Value", "Percentage"],
        ["Total Comments", totalComments.toString(), "100%"],
        [
          "Positive Comments",
          sentiments.positive.toString(),
          `${
            totalComments > 0
              ? Math.round((sentiments.positive / totalComments) * 100)
              : 0
          }%`,
        ],
        [
          "Negative Comments",
          sentiments.negative.toString(),
          `${
            totalComments > 0
              ? Math.round((sentiments.negative / totalComments) * 100)
              : 0
          }%`,
        ],
        [
          "Neutral Comments",
          sentiments.neutral.toString(),
          `${
            totalComments > 0
              ? Math.round((sentiments.neutral / totalComments) * 100)
              : 0
          }%`,
        ],
        ["", "", ""],
        [
          "Time Range",
          formatDateForInput(startTime).replace("T", " "),
          formatDateForInput(endTime).replace("T", " "),
        ],
        ["Export Date", new Date().toISOString(), ""],
      ];

      csvString = summaryData
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
      filename = `sentiment_summary_${
        formatDateForInput(new Date()).split("T")[0]
      }.csv`;
    } else {
      let commentsForExport = filteredComments;

      if (exportType === "filtered") {
        if (selectedEmojis.length > 0) {
          commentsForExport = commentsForExport.filter((comment) =>
            selectedEmojis.some((emoji) => comment.reactions.includes(emoji))
          );
        }

        if (sentimentFilter !== "all") {
          commentsForExport = commentsForExport.filter(
            (comment) => comment.sentiment === sentimentFilter
          );
        }
      }

      if (commentsForExport.length === 0) {
        alert("No data to export based on current filters.");
        return;
      }

      const headers = [
        "ID",
        "Timestamp",
        "User",
        "Text",
        "Sentiment",
        "Reactions",
      ];
      const csvRows = [
        headers.join(","),
        ...commentsForExport.map((comment) =>
          [
            comment.id,
            comment.timestamp.toISOString(),
            `"${comment.user.replace(/"/g, '""')}"`,
            `"${comment.text.replace(/"/g, '""')}"`,
            comment.sentiment,
            `"${comment.reactions.join(" ")}"`,
          ].join(",")
        ),
      ];
      csvString = csvRows.join("\n");
      filename = `social_media_${exportType}_${
        formatDateForInput(new Date()).split("T")[0]
      }.csv`;
    }

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const contextValue: DashboardContextType = {
    allComments,
    filteredComments,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    selectedEmojis,
    handleEmojiFilterChange,
    sortBy,
    sentimentFilter,
    setSortBy,
    setSentimentFilter,
    theme,
    setTheme,
    palette,
    lastUpdate,
    now,
    dataUpdateIndicator,
    handleCsvExport,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
