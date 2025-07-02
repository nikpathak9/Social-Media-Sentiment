import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { useDashboard } from "../../context/DashboardContext";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const {
    allComments: comments,
    selectedEmojis,
    sortBy,
    sentimentFilter,
    theme,
    palette,
  } = useDashboard();

  const [displayCount, setDisplayCount] = useState(50);
  const modalRef = useRef<HTMLDivElement>(null);

  const historicalComments = useMemo(() => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    let filtered = comments.filter(
      (comment) => comment.timestamp < thirtyMinutesAgo
    );

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

    return sorted.slice(0, displayCount);
  }, [comments, selectedEmojis, sortBy, sentimentFilter, displayCount]);

  const loadMoreHistory = () => {
    setDisplayCount((prev) => prev + 50);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      const scrollY = window.scrollY;

      document.addEventListener("mousedown", handleClickOutside);

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      if (isOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.classList.remove("modal-open");

        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        transition: "opacity 0.2s",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: palette.card,
          borderRadius: "16px",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.1)",
          border: `1px solid ${palette.border}`,
          overflow: "hidden",
          position: "relative",
          animation: "modal-fade-in 0.3s ease-out",
          margin: "0 auto",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${palette.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                color: palette.text,
                fontSize: "1.3rem",
              }}
            >
              Comment History
            </h3>
            <p
              style={{ margin: 0, color: palette.subtext, fontSize: "0.9rem" }}
            >
              Previous conversations • {historicalComments.length} comments
              found
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: `1px solid ${palette.border}`,
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              color: palette.text,
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              transition: "all 0.2s ease",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            minHeight: 0,
          }}
        >
          {historicalComments.length > 0 ? (
            <>
              {historicalComments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: palette.border,
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    borderRadius: "8px",
                    backgroundColor: palette.card,
                    boxShadow:
                      theme === "dark"
                        ? "0 2px 8px rgba(0,0,0,0.15)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                    borderLeft: `4px solid ${
                      palette.sentiment[comment.sentiment]
                    }`,
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: palette.accent,
                        fontSize: "0.9rem",
                      }}
                    >
                      {comment.user}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 0.75rem 0",
                      color: palette.text,
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {comment.text}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.3rem 0.6rem",
                        backgroundColor: `${
                          palette.sentiment[comment.sentiment]
                        }20`,
                        borderRadius: "12px",
                        border: `1px solid ${
                          palette.sentiment[comment.sentiment]
                        }40`,
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: palette.sentiment[comment.sentiment],
                        }}
                      />
                      <span
                        style={{
                          color: palette.sentiment[comment.sentiment],
                          fontWeight: "600",
                          textTransform: "capitalize",
                          fontSize: "0.85rem",
                        }}
                      >
                        {comment.sentiment}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        padding: "0.25rem",
                        backgroundColor:
                          theme === "dark" ? "#1e2329" : "#f8fafc",
                        borderRadius: "8px",
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      {comment.reactions.map((reaction, index) => (
                        <span
                          key={index}
                          className='emoji-pop'
                          style={{
                            fontSize: "1.1rem",
                            padding: "0.2rem",
                            borderRadius: "4px",
                            transition: "transform 0.2s ease",
                            display: "inline-block",
                          }}
                        >
                          {reaction}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {displayCount <
                comments.filter(
                  (c) => new Date(Date.now() - 30 * 60 * 1000) > c.timestamp
                ).length && (
                <div style={{ textAlign: "center", margin: "1rem 0" }}>
                  <button
                    onClick={loadMoreHistory}
                    style={{
                      padding: "0.6rem 1.2rem",
                      fontSize: "0.9rem",
                      border: `1px solid ${palette.border}`,
                      backgroundColor: palette.emojiBtn,
                      color: palette.text,
                      cursor: "pointer",
                      borderRadius: "8px",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    Load More History
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: palette.subtext,
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</div>
              <h4 style={{ margin: "0 0 0.5rem 0", color: palette.text }}>
                No History Found
              </h4>
              <p style={{ margin: 0 }}>
                No previous conversations match your current filters.
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${palette.border}`,
            display: "flex",
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.6rem 1.2rem",
              fontSize: "0.9rem",
              border: "none",
              backgroundColor: palette.accent,
              color: "white",
              cursor: "pointer",
              borderRadius: "8px",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            Back to Live Stream
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HistoryModal;
