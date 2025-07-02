import React, { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const AudiencePostsDisplay: React.FC = () => {
  const { filteredComments: comments, theme, palette } = useDashboard();

  const audienceData = useMemo(() => {
    if (comments.length === 0) return [];

    const sources = [
      {
        name: "Power Users",
        pattern: /^(TechGuru|SocialStar)/,
        icon: "🔥",
        color: palette.sentiment.positive,
      },
      {
        name: "News Sources",
        pattern: /^(NewsBot)/,
        icon: "📰",
        color: palette.accent,
      },
      {
        name: "Beta Testers",
        pattern: /^(BetaTester|UserAlpha)/,
        icon: "🧪",
        color: palette.sentiment.neutral,
      },
      {
        name: "General Users",
        pattern: /^(CommenterGamma|RandomUser123)/,
        icon: "👥",
        color: palette.sentiment.negative,
      },
    ];

    const results = sources
      .map((source) => {
        const count = comments.filter((comment) =>
          source.pattern.test(comment.user)
        ).length;
        return {
          name: source.name,
          icon: source.icon,
          color: source.color,
          posts: count,
          percentage:
            comments.length > 0
              ? Math.round((count / comments.length) * 100)
              : 0,
        };
      })
      .filter((item) => item.posts > 0);

    return results.sort((a, b) => b.posts - a.posts);
  }, [comments, palette]);

  if (audienceData.length === 0) {
    return (
      <p
        style={{ textAlign: "center", color: palette.subtext, padding: "2rem" }}
      >
        No audience data available.
      </p>
    );
  }

  const maxPosts = Math.max(...audienceData.map((item) => item.posts));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h4
        style={{
          margin: "0 0 0.5rem 0",
          fontSize: "1.05em",
          color: palette.text,
          fontWeight: 500,
        }}
      >
        Audience Posts
      </h4>
      <p
        style={{
          margin: "0 0 1rem 0",
          fontSize: "0.85rem",
          color: palette.subtext,
        }}
      >
        Posts shared by audience
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {audienceData.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem",
              backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
              borderRadius: "8px",
              border: `1px solid ${palette.border}`,
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                minWidth: "160px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: `${item.color}20`,
                  border: `2px solid ${item.color}30`,
                }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              </div>
              <span
                style={{
                  fontSize: "0.9rem",
                  color: palette.text,
                  fontWeight: 500,
                }}
              >
                {item.name}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "40px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: item.color,
                    fontWeight: 600,
                  }}
                >
                  {item.posts}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: palette.subtext,
                    fontWeight: 500,
                  }}
                >
                  {item.percentage}%
                </span>
              </div>

              <div
                style={{
                  flex: 1,
                  height: "8px",
                  backgroundColor: theme === "dark" ? "#2a2e3a" : "#f1f5f9",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: `1px solid ${
                    theme === "dark" ? "#3a4252" : "#e2e8f0"
                  }`,
                  maxWidth: "140px",
                }}
              >
                <div
                  style={{
                    width: `${(item.posts / maxPosts) * 100}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                    borderRadius: "3px",
                    transition: "width 0.4s ease",
                    boxShadow: `0 1px 3px ${item.color}40`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudiencePostsDisplay;