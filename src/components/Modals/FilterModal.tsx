import React, { useRef, useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { AVAILABLE_REACTIONS } from "../../utils/mockData";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onClearFilters,
}) => {
  const {
    selectedEmojis,
    handleEmojiFilterChange,
    sortBy,
    setSortBy,
    sentimentFilter,
    setSentimentFilter,
    palette,
  } = useDashboard();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          backdropFilter: "blur(2px)",
          transition: "opacity 0.3s ease",
          opacity: isOpen ? 1 : 0,
        }}
        onClick={onClose}
        role='presentation'
      />
      <div
        ref={modalRef}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: isOpen
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.95)",
          backgroundColor: palette.card,
          border: `1px solid ${palette.border}`,
          borderRadius: "12px",
          padding: "1.5rem",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: palette.shadow,
          zIndex: 9999,
          transition: "transform 0.3s ease, opacity 0.3s ease",
          opacity: isOpen ? 1 : 0,
        }}
        role='dialog'
        aria-labelledby='filter-modal-title'
        aria-modal='true'
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <h3
            id='filter-modal-title'
            style={{
              margin: 0,
              fontSize: "1.2rem",
              color: palette.text,
              fontWeight: 600,
            }}
          >
            Filter Options
          </h3>

          {/* Filter by Reactions */}
          <div>
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1rem",
                color: palette.text,
                fontWeight: 500,
              }}
            >
              Filter by Reactions:
            </h4>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {AVAILABLE_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiFilterChange(emoji)}
                  title={`Filter by ${emoji}`}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "1.2rem",
                    border: selectedEmojis.includes(emoji)
                      ? `2px solid ${palette.accent}`
                      : `1px solid ${palette.border}`,
                    backgroundColor: selectedEmojis.includes(emoji)
                      ? `${palette.accent}20`
                      : palette.emojiBtn,
                    cursor: "pointer",
                    borderRadius: "20px",
                    transition: "all 0.3s ease",
                    boxShadow: selectedEmojis.includes(emoji)
                      ? `0 2px 8px ${palette.accent}40`
                      : "0 1px 3px rgba(0,0,0,0.1)",
                    transform: selectedEmojis.includes(emoji)
                      ? "scale(1.05)"
                      : "scale(1)",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h4
              style={{
                fontSize: "1rem",
                color: palette.text,
                fontWeight: 500,
              }}
            >
              Sort By:
            </h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "recent" | "liked" | "sentiment")
                }
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "1rem",
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.card,
                  color: palette.text,
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                {[
                  { key: "recent", label: "Most Recent" },
                  { key: "liked", label: "Most Liked" },
                  { key: "sentiment", label: "Sentiment" },
                ].map((sort) => (
                  <option key={sort.key} value={sort.key}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sentiment Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1rem",
                color: palette.text,
                fontWeight: 500,
              }}
            >
              Sentiment:
            </h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <select
                value={sentimentFilter}
                onChange={(e) =>
                  setSentimentFilter(
                    e.target.value as
                      | "all"
                      | "positive"
                      | "neutral"
                      | "negative"
                  )
                }
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "1rem",
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.card,
                  color: palette.text,
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                {[
                  { key: "all", label: "All" },
                  { key: "positive", label: "Positive" },
                  { key: "neutral", label: "Neutral" },
                  { key: "negative", label: "Negative" },
                ].map((sentiment) => (
                  <option key={sentiment.key} value={sentiment.key}>
                    {sentiment.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: palette.card,
                color: palette.text,
                border: `1px solid ${palette.border}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Close
            </button>
            <button
              onClick={onClearFilters}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: palette.sentiment.negative,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
