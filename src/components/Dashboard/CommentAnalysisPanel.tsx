import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDashboard } from "../../context/DashboardContext";
import type { Comment } from "../../types";
import HistoryModal from "../Modals/HistoryModal";
import FilterModal from "../Modals/FilterModal";
import { ListFilter } from "lucide-react";

const CommentAnalysisPanel: React.FC = () => {
  const {
    allComments,
    filteredComments: comments, // This is already filtered by time range
    selectedEmojis,
    handleEmojiFilterChange,
    sortBy,
    sentimentFilter,
    setSortBy,
    setSentimentFilter,
    theme,
    palette,
  } = useDashboard();

  const [autoScroll, setAutoScroll] = useState(true);
  const [newCommentCount, setNewCommentCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevCommentsLength = useRef(comments.length);

  // Track new comments based on filteredComments (which includes time range filtering)
  useEffect(() => {
    if (comments.length > prevCommentsLength.current) {
      const newComments = comments.length - prevCommentsLength.current;
      setNewCommentCount((prev) => prev + newComments);

      if (autoScroll && isAtBottom && scrollContainerRef.current) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    }
    prevCommentsLength.current = comments.length;
  }, [comments, autoScroll, isAtBottom]);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAtBottom(isBottom);

      if (isBottom) {
        setNewCommentCount(0);
      }
    }
  }, []);

  const commentsToDisplay = useMemo(() => {
    let filtered = [...comments]; // Use filteredComments which already includes time range

    if (selectedEmojis.length > 0) {
      filtered = filtered.filter((comment) =>
        selectedEmojis.some((emoji) => comment.reactions.includes(emoji))
      );
    }

    if (sentimentFilter !== "all") {
      filtered = filtered.filter(
        (comment) => comment.sentiment === sentimentFilter
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.timestamp.getTime() - a.timestamp.getTime();
        case "liked":
          return b.reactions.length - a.reactions.length;
        case "sentiment": {
          const sentimentOrder = { positive: 2, neutral: 1, negative: 0 };
          return sentimentOrder[b.sentiment] - sentimentOrder[a.sentiment];
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [comments, selectedEmojis, sortBy, sentimentFilter]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
    setNewCommentCount(0);
  };

  const recentCommentsCount = useMemo(() => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return allComments.filter((comment) => comment.timestamp > fiveMinutesAgo)
      .length;
  }, [allComments]);

  const handleClearFilters = () => {
    selectedEmojis.forEach((emoji) => handleEmojiFilterChange(emoji));
    setSortBy("recent");
    setSentimentFilter("all");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.5rem",
          padding: "0.5rem",
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
            LIVE STREAM
          </span>
        </div>

        <span
          style={{
            fontSize: "0.75rem",
            color: palette.subtext,
            background: theme === "dark" ? "#232936" : "#e2e8f0",
            padding: "0.2rem 0.5rem",
            borderRadius: "10px",
          }}
        >
          {recentCommentsCount} in last 5min
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setIsFilterModalOpen(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: palette.accent,
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <span>
            <ListFilter />
          </span>{" "}
          All Filters
        </button>
        {(selectedEmojis.length > 0 ||
          sentimentFilter !== "all" ||
          sortBy !== "recent") && (
          <button
            onClick={handleClearFilters}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: palette.sentiment.negative,
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onClearFilters={handleClearFilters}
      />

      {/* Live Stream Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          padding: "0.5rem",
          backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
          borderRadius: "6px",
          border: `1px solid ${palette.border}`,
          flexWrap: "wrap",
          gap: "0.5rem",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.8rem",
              border: `1px solid ${palette.border}`,
              backgroundColor: palette.emojiBtn,
              color: palette.text,
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            Switch to History
          </button>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
            }}
          >
            <input
              type='checkbox'
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              style={{
                marginRight: "0.2rem",
                cursor: "pointer",
                accentColor: palette.accent,
              }}
            />
            <span
              style={{
                fontSize: "0.8rem",
                color: palette.text,
                userSelect: "none",
              }}
            >
              Auto-scroll
            </span>
          </label>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h4 style={{ margin: 0, fontSize: "1.1em", color: palette.text }}>
          Comments ({commentsToDisplay.length} of {comments.length})
          {(selectedEmojis.length > 0 || sentimentFilter !== "all") && (
            <span
              style={{
                fontSize: "0.85rem",
                color: palette.subtext,
                fontWeight: 400,
              }}
            >
              {" "}
              • Filtered
            </span>
          )}
        </h4>

        {newCommentCount > 0 && !isAtBottom && (
          <button
            onClick={scrollToBottom}
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.8rem",
              background: `linear-gradient(135deg, ${palette.sentiment.positive}, ${palette.sentiment.positive}dd)`,
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: `0 2px 8px ${palette.sentiment.positive}40`,
              animation: "new-comments-pulse 2s infinite",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            ↓ {newCommentCount} new
          </button>
        )}
      </div>

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      {/* Comments List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem",
        }}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {commentsToDisplay.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: palette.subtext,
              padding: "2rem",
            }}
          >
            No comments match the selected filters.
          </p>
        ) : (
          commentsToDisplay.map((comment, index) => {
            // Check if comment is very recent (last 10 seconds)
            const isVeryRecent =
              Date.now() - comment.timestamp.getTime() < 10000;

            return (
              <div
                key={comment.id}
                className={index < 3 ? "new-comments-pulse" : ""}
                style={{
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  backgroundColor: isVeryRecent
                    ? theme === "dark"
                      ? "#1e2d1e"
                      : "#f0fdf4"
                    : theme === "dark"
                    ? "#1e2329"
                    : "#f8fafc",
                  border: `1px solid ${
                    isVeryRecent
                      ? palette.sentiment.positive + "40"
                      : palette.border
                  }`,
                  borderRadius: "8px",
                  boxShadow: isVeryRecent
                    ? `0 4px 12px ${palette.sentiment.positive}20`
                    : palette.shadow,
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                {isVeryRecent && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      backgroundColor: palette.sentiment.positive,
                      color: "white",
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "10px",
                      fontWeight: 600,
                      animation: "new-badge-glow 2s ease-in-out infinite",
                    }}
                  >
                    NEW
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: palette.text,
                        fontSize: "0.9rem",
                      }}
                    >
                      {comment.user}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: palette.subtext,
                      }}
                    >
                      {comment.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: palette.sentiment[comment.sentiment],
                      textTransform: "capitalize",
                    }}
                  >
                    {comment.sentiment}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0.5rem 0",
                    color: palette.text,
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                  }}
                >
                  {comment.text}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginTop: "0.5rem",
                  }}
                >
                  {comment.reactions.map((reaction, idx) => (
                    <span
                      key={`${comment.id}-reaction-${idx}`}
                      className='emoji-pop'
                      style={{
                        fontSize: "1rem",
                        cursor: "default",
                      }}
                    >
                      {reaction}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentAnalysisPanel;
