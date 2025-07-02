import React, { useState, useEffect, useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";

const WordCloudDisplay: React.FC = () => {
  const { filteredComments: comments, theme, palette } = useDashboard();
  const [prevTopics, setPrevTopics] = useState<{ [word: string]: number }>({});
  const [animatingWords, setAnimatingWords] = useState<Set<string>>(new Set());
  const [isLiveMode] = useState(true);
  const [liveUpdateCount, setLiveUpdateCount] = useState(0);
  const [newTopics, setNewTopics] = useState<Set<string>>(new Set());

  const topics = useMemo(() => {
    const wordCounts: Record<
      string,
      {
        count: number;
        sentiments: { positive: number; negative: number; neutral: number };
      }
    > = {};
    const stopWords = new Set([
      "a",
      "an",
      "the",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "i",
      "me",
      "my",
      "you",
      "your",
      "he",
      "him",
      "his",
      "she",
      "her",
      "it",
      "its",
      "we",
      "us",
      "our",
      "they",
      "them",
      "their",
      "this",
      "that",
      "to",
      "of",
      "in",
      "on",
      "for",
      "with",
      "s",
      "t",
      "not",
    ]);

    comments.forEach((comment) => {
      const words = comment.text
        .toLowerCase()
        .replace(/[^ -\w\s']|_/g, "")
        .replace(/\s+/g, " ")
        .split(/\s+/);
      words.forEach((word) => {
        if (word.length > 2 && !stopWords.has(word) && isNaN(Number(word))) {
          if (!wordCounts[word]) {
            wordCounts[word] = {
              count: 0,
              sentiments: { positive: 0, negative: 0, neutral: 0 },
            };
          }
          wordCounts[word].count++;
          wordCounts[word].sentiments[comment.sentiment]++;
        }
      });
    });

    return Object.entries(wordCounts)
      .map(([text, data]) => {
        const sentiments = data.sentiments;
        let dominantSentiment: "positive" | "negative" | "neutral" = "neutral";
        if (
          sentiments.positive > sentiments.negative &&
          sentiments.positive > sentiments.neutral
        ) {
          dominantSentiment = "positive";
        } else if (
          sentiments.negative > sentiments.positive &&
          sentiments.negative > sentiments.neutral
        ) {
          dominantSentiment = "negative";
        }

        return {
          text,
          value: data.count,
          sentiment: dominantSentiment,
          sentimentStrength:
            Math.max(
              sentiments.positive,
              sentiments.negative,
              sentiments.neutral
            ) / data.count,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 30);
  }, [comments]);

  const topicsSignature = useMemo(
    () => topics.map((t) => `${t.text}:${t.value}`).join(","),
    [topics]
  );

  useEffect(() => {
    if (isLiveMode) {
      const currentTopicMap: { [word: string]: number } = {};
      const newAnimatingWords = new Set<string>();
      const currentNewTopics = new Set<string>();

      topics.forEach((t) => {
        currentTopicMap[t.text] = t.value;

        if (!prevTopics[t.text]) {
          currentNewTopics.add(t.text);
          newAnimatingWords.add(t.text);
          setLiveUpdateCount((prev) => prev + 1);
        } else if (Math.abs(prevTopics[t.text] - t.value) > 0) {
          newAnimatingWords.add(t.text);
        }
      });

      setAnimatingWords(newAnimatingWords);
      setNewTopics(currentNewTopics);
      setPrevTopics(currentTopicMap);

      const newTopicTimer = setTimeout(() => {
        setNewTopics(new Set());
      }, 2000);

      const animationTimer = setTimeout(() => {
        setAnimatingWords(new Set());
      }, 1000);

      return () => {
        clearTimeout(newTopicTimer);
        clearTimeout(animationTimer);
      };
    }
  }, [topicsSignature, isLiveMode, prevTopics]);

  if (topics.length === 0) {
    return (
      <p
        style={{ textAlign: "center", color: palette.subtext, padding: "2rem" }}
      >
        No trending topics in selected range.
      </p>
    );
  }

  const maxFreq = Math.max(...topics.map((t) => t.value), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          padding: "0.5rem",
          backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
          borderRadius: "6px",
          border: `1px solid ${palette.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#4ade80",
              animation: "live-pulse 1.5s infinite",
              transition: "all 0.3s ease",
            }}
          />
          <span
            style={{
              fontSize: "0.85rem",
              color: palette.sentiment.positive,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            LIVE
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: palette.subtext,
              marginLeft: "0.5rem",
            }}
          >
            {liveUpdateCount} updates
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem 0.8rem",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "220px",
          flex: 1,
          marginBottom: "0.5rem",
          padding: "1rem 0.5rem",
        }}
      >
        {topics.map((topic) => {
          const baseColor = palette.sentiment[topic.sentiment];
          const isAnimating = animatingWords.has(topic.text) && isLiveMode;
          const isNew = newTopics.has(topic.text);

          let opacity = 0.7 + 0.3 * topic.sentimentStrength;
          let backgroundColor = `${baseColor}10`;
          let border = `1px solid ${baseColor}30`;
          let boxShadow = isAnimating ? `0 0 15px ${baseColor}60` : "none";

          if (isNew && isLiveMode) {
            opacity = 1;
            backgroundColor = `${baseColor}25`;
            border = `2px solid ${baseColor}60`;
            boxShadow = `0 0 20px ${baseColor}80, inset 0 0 10px ${baseColor}20`;
          }

          return (
            <div
              key={topic.text}
              title={`${topic.text} (Count: ${topic.value}, Sentiment: ${
                topic.sentiment
              }) ${isNew ? "• NEW" : ""}`}
              className={
                isAnimating
                  ? isNew
                    ? "word-pop-in new-topic"
                    : "word-pulse"
                  : isNew
                  ? "new-topic"
                  : ""
              }
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "15px",
                padding: "0.3rem 0.6rem",
                color: baseColor,
                opacity: opacity,
                fontWeight: isNew
                  ? "800"
                  : topic.value / maxFreq > 0.5
                  ? "700"
                  : "500",
                cursor: "default",
                transition: "all 0.6s cubic-bezier(0.4,0.2,0.2,1)",
                willChange: "font-size, color, opacity",
                borderRadius: "6px",
                backgroundColor: backgroundColor,
                border: border,
                boxShadow: boxShadow,
                position: "relative",
                transform: isNew && isLiveMode ? "scale(1.05)" : "scale(1)",
              }}
            >
              {topic.text}
              {isNew && isLiveMode && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: palette.sentiment.positive,
                    color: "white",
                    fontSize: "0.6rem",
                    padding: "2px 4px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: `0 2px 4px ${palette.sentiment.positive}40`,
                    animation: "new-badge-glow 2s ease-in-out infinite",
                  }}
                >
                  NEW
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordCloudDisplay;
