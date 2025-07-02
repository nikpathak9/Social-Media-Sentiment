import React, { useState, useEffect, useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";

const SentimentMeterDisplay: React.FC = () => {
  const { filteredComments: comments, theme, palette } = useDashboard();
  type SourceSentiment = {
    name: string;
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  const [prevData, setPrevData] = useState<SourceSentiment[]>([]);
  const [animatingBars, setAnimatingBars] = useState<Set<string>>(new Set());
  const [prevSentimentData, setPrevSentimentData] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [pieAnimating, setPieAnimating] = useState(false);

  const sourceData = useMemo(() => {
    if (comments.length === 0) return [];

    const sources = [
      { name: "Power Users", pattern: /^(TechGuru|SocialStar)/ },
      { name: "News Sources", pattern: /^(NewsBot)/ },
      { name: "Beta Testers", pattern: /^(BetaTester|UserAlpha)/ },
      { name: "General Users", pattern: /^(CommenterGamma|RandomUser123)/ },
    ];

    return sources
      .map((source) => {
        const sourceComments = comments.filter((comment) =>
          source.pattern.test(comment.user)
        );

        if (sourceComments.length === 0) {
          return {
            name: source.name,
            positive: 0,
            negative: 0,
            neutral: 0,
            total: 0,
          };
        }

        const sentiments = {
          positive: 0,
          negative: 0,
          neutral: 0,
          total: sourceComments.length,
        };
        sourceComments.forEach((comment) => {
          sentiments[comment.sentiment]++;
        });

        return {
          name: source.name,
          positive: Math.round((sentiments.positive / sentiments.total) * 100),
          negative: Math.round((sentiments.negative / sentiments.total) * 100),
          neutral: Math.round((sentiments.neutral / sentiments.total) * 100),
          total: sentiments.total,
        };
      })
      .filter((source) => source.total > 0);
  }, [comments]);

  const sentimentData = useMemo(() => {
    if (comments.length === 0) return { positive: 0, negative: 0, neutral: 0 };

    const totals = { positive: 0, negative: 0, neutral: 0 };
    comments.forEach((comment) => {
      totals[comment.sentiment]++;
    });

    const total = comments.length;
    return {
      positive: Math.round((totals.positive / total) * 100),
      negative: Math.round((totals.negative / total) * 100),
      neutral: Math.round((totals.neutral / total) * 100),
    };
  }, [comments]);

  useEffect(() => {
    const newAnimatingBars = new Set<string>();

    sourceData.forEach((source) => {
      const prevSource = prevData.find((p) => p.name === source.name);
      if (
        !prevSource ||
        prevSource.positive !== source.positive ||
        prevSource.negative !== source.negative ||
        prevSource.neutral !== source.neutral
      ) {
        newAnimatingBars.add(source.name);
      }
    });

    setAnimatingBars(newAnimatingBars);
    setPrevData(sourceData);

    const timer = setTimeout(() => {
      setAnimatingBars(new Set());
    }, 800);

    return () => clearTimeout(timer);
  }, [sourceData, prevData]);

  useEffect(() => {
    if (
      prevSentimentData.positive !== sentimentData.positive ||
      prevSentimentData.negative !== sentimentData.negative ||
      prevSentimentData.neutral !== sentimentData.neutral
    ) {
      setPieAnimating(true);
      const timer = setTimeout(() => setPieAnimating(false), 1000);
      setPrevSentimentData(sentimentData);
      return () => clearTimeout(timer);
    }
  }, [sentimentData, prevSentimentData]);

  if (sourceData.length === 0) {
    return (
      <p style={{ textAlign: "center", color: palette.subtext }}>
        No sentiment data in selected range.
      </p>
    );
  }

  const SentimentBar = ({
    percentage,
    color,
    isAnimating,
  }: {
    percentage: number;
    color: string;
    isAnimating?: boolean;
  }) => (
    <div
      style={{
        width: "50px",
        height: "5px",
        backgroundColor: theme === "dark" ? "#2a2e3a" : "#f1f5f9",
        borderRadius: "3px",
        overflow: "hidden",
        margin: "0 auto",
        border: `1px solid ${theme === "dark" ? "#3a4252" : "#e2e8f0"}`,
        boxShadow: isAnimating ? `0 0 8px ${color}60` : "none",
      }}
    >
      <div
        className={isAnimating ? "sentiment-bar-pulse" : ""}
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius: "2px",
          transition: "width 0.6s ease, box-shadow 0.3s ease",
        }}
      />
    </div>
  );

  const radius = 35;
  const centerX = 60;
  const centerY = 60;

  const positiveAngle = (sentimentData.positive / 100) * 360;
  const negativeAngle = (sentimentData.negative / 100) * 360;
  const neutralAngle = (sentimentData.neutral / 100) * 360;

  const createPath = (startAngle: number, endAngle: number) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = 0;
  const segments = [
    {
      label: "Positive",
      value: sentimentData.positive,
      color: palette.sentiment.positive,
      path:
        sentimentData.positive > 0
          ? createPath(currentAngle, currentAngle + positiveAngle)
          : "",
    },
  ];
  currentAngle += positiveAngle;

  if (sentimentData.negative > 0) {
    segments.push({
      label: "Negative",
      value: sentimentData.negative,
      color: palette.sentiment.negative,
      path: createPath(currentAngle, currentAngle + negativeAngle),
    });
  }
  currentAngle += negativeAngle;

  if (sentimentData.neutral > 0) {
    segments.push({
      label: "Neutral",
      value: sentimentData.neutral,
      color: palette.sentiment.neutral,
      path: createPath(currentAngle, currentAngle + neutralAngle),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <h5
          style={{
            margin: "0 0 0.75rem 0",
            fontSize: "0.9em",
            color: palette.text,
            fontWeight: 500,
          }}
        >
          Overall Sentiment Distribution
        </h5>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flex: 0.5,
            justifyContent: "center",
            marginTop: "1rem",
            padding: "2rem 0",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <svg
              width='120'
              height='120'
              style={{
                overflow: "visible",
                transform: pieAnimating ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                marginLeft: "30px",
              }}
              className='pie-chart-container'
            >
              <circle
                cx={centerX}
                cy={centerY}
                r={radius + 5}
                fill='none'
                stroke={
                  theme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)"
                }
                strokeWidth='1'
                className='pie-background-glow'
              />

              {segments.map(
                (segment, index) =>
                  segment.path && (
                    <g key={index}>
                      <path
                        d={segment.path}
                        fill={segment.color}
                        opacity='0.3'
                        transform='translate(2, 2)'
                        className='pie-segment-shadow'
                      />

                      <path
                        d={segment.path}
                        fill={segment.color}
                        stroke={palette.card}
                        strokeWidth='3'
                        style={{
                          cursor: "pointer",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          filter: pieAnimating
                            ? `drop-shadow(0 6px 12px ${segment.color}50) drop-shadow(0 0 20px ${segment.color}30) brightness(1.1)`
                            : `drop-shadow(0 4px 8px ${segment.color}30)`,
                          transformOrigin: `${centerX}px ${centerY}px`,
                          animation: `pie-segment-entry 1s ease-out ${
                            index * 0.2
                          }s both`,
                        }}
                        className={`pie-segment ${
                          pieAnimating ? "pie-segment-pulse" : ""
                        }`}
                      />
                    </g>
                  )
              )}

              <defs>
                <radialGradient id='pieGradient' cx='50%' cy='50%' r='50%'>
                  <stop offset='0%' stopColor='rgba(255,255,255,0.4)' />
                  <stop offset='100%' stopColor='rgba(255,255,255,0)' />
                </radialGradient>

                <filter id='pieGlow'>
                  <feGaussianBlur stdDeviation='3' result='coloredBlur' />
                  <feMerge>
                    <feMergeNode in='coloredBlur' />
                    <feMergeNode in='SourceGraphic' />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {segments.map((segment, index) => {
              if (!segment.path || segment.value === 0) return null;

              const angle =
                index * (360 / segments.length) + 360 / segments.length / 2;
              const radian = (angle * Math.PI) / 180;
              const x = centerX + (radius + 25) * Math.cos(radian);
              const y = centerY + (radius + 25) * Math.sin(radian);

              return (
                <div
                  key={`indicator-${index}`}
                  style={{
                    position: "absolute",
                    left: `${x - 20}px`,
                    top: `${y - 10}px`,
                    width: "40px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: segment.color,
                    marginLeft: "30px",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    borderRadius: "10px",
                    boxShadow: `0 2px 8px ${segment.color}40`,
                    animation: `pie-indicator-float 2s ease-in-out infinite ${
                      index * 0.3
                    }s`,
                    zIndex: 10,
                  }}
                  className='pie-percentage-indicator'
                >
                  {segment.value}%
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {segments.map((segment, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: segment.color,
                    borderRadius: "2px",
                    border: `1px solid ${segment.color}60`,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: palette.text,
                    fontWeight: 500,
                  }}
                >
                  {segment.label}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: segment.color,
                    fontWeight: 600,
                  }}
                >
                  {segment.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h4
        style={{
          margin: "1rem 0 1rem 0",
          fontSize: "1.05em",
          color: palette.text,
          fontWeight: 500,
        }}
      >
        Sentiment by Source
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 80px 80px",
          gap: "6px",
          padding: "10px 12px",
          backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
          borderRadius: "8px 8px 0 0",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: palette.subtext,
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          border: `1px solid ${palette.border}`,
          borderBottom: "none",
        }}
      >
        <div>Source</div>
        <div style={{ textAlign: "center" }}>Positive</div>
        <div style={{ textAlign: "center" }}>Negative</div>
        <div style={{ textAlign: "center" }}>Neutral</div>
      </div>

      {sourceData.map((source, index) => {
        const isAnimating = animatingBars.has(source.name);
        return (
          <div
            key={source.name}
            className={isAnimating ? "sentiment-row-update" : ""}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 80px 80px",
              gap: "6px",
              padding: "12px",
              backgroundColor: palette.card,
              borderBottom:
                index === sourceData.length - 1
                  ? `1px solid ${palette.border}`
                  : `1px solid ${palette.border}`,
              borderLeft: `1px solid ${palette.border}`,
              borderRight: `1px solid ${palette.border}`,
              fontSize: "0.85rem",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                fontWeight: 500,
                color: palette.text,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: isAnimating
                    ? palette.accent
                    : palette.accent,
                  flexShrink: 0,
                  boxShadow: isAnimating
                    ? `0 0 8px ${palette.accent}80`
                    : "none",
                  transition: "box-shadow 0.3s ease",
                }}
              />
              <span style={{ fontSize: "0.85rem" }}>{source.name}</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: palette.sentiment.positive,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textShadow: isAnimating
                    ? `0 0 8px ${palette.sentiment.positive}60`
                    : "none",
                  transition: "text-shadow 0.3s ease",
                }}
              >
                {source.positive}%
              </span>
              <SentimentBar
                percentage={source.positive}
                color={palette.sentiment.positive}
                isAnimating={isAnimating}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: palette.sentiment.negative,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textShadow: isAnimating
                    ? `0 0 8px ${palette.sentiment.negative}60`
                    : "none",
                  transition: "text-shadow 0.3s ease",
                }}
              >
                {source.negative}%
              </span>
              <SentimentBar
                percentage={source.negative}
                color={palette.sentiment.negative}
                isAnimating={isAnimating}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: palette.sentiment.neutral,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textShadow: isAnimating
                    ? `0 0 8px ${palette.sentiment.neutral}60`
                    : "none",
                  transition: "text-shadow 0.3s ease",
                }}
              >
                {source.neutral}%
              </span>
              <SentimentBar
                percentage={source.neutral}
                color={palette.sentiment.neutral}
                isAnimating={isAnimating}
              />
            </div>
          </div>
        );
      })}

      <div
        style={{
          padding: "10px 12px",
          backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
          borderRadius: "0 0 8px 8px",
          border: `1px solid ${palette.border}`,
          borderTop: "none",
          fontSize: "0.8rem",
          color: palette.subtext,
          textAlign: "center",
        }}
      >
        Total Comments Analyzed: {comments.length}
      </div>
    </div>
  );
};

export default SentimentMeterDisplay;
