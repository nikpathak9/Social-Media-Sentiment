import React, { useState, useRef, useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import type { ExportType } from "../../types";
import { ChartArea } from "lucide-react";

interface ExportSelectorProps {
  onExport: (type: ExportType) => void;
}

const ExportSelector: React.FC<ExportSelectorProps> = ({ onExport }) => {
  const { theme, palette } = useDashboard();
  const [selectedType, setSelectedType] = useState<ExportType>("filtered");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const exportTypes = [
    {
      key: "full" as const,
      label: "Full Dataset",
      desc: "All comments in time range",
    },
    {
      key: "filtered" as const,
      label: "Filtered Comments",
      desc: "Only comments matching filters",
    },
    {
      key: "summary" as const,
      label: "Sentiment Summary",
      desc: "Aggregated sentiment data",
    },
  ];

  const handleExport = () => {
    onExport(selectedType);
    setIsOpen(false);
  };

  const handleTypeSelect = (type: ExportType) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
        <button
          onClick={handleExport}
          style={{
            padding: "10px 14px",
            backgroundColor: theme === "dark" ? palette.card : palette.accent,
            color: theme === "dark" ? palette.text : "white",
            border: "none",
            borderRadius: "8px 0 0 8px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: "40px",
            minHeight: "40px",
            borderRight: `1px solid ${
              theme === "dark" ? "#1e40af" : "#2563eb"
            }`,
          }}
        >
          <span>
            <ChartArea />
          </span>
          Export
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "0 12px",
            backgroundColor: theme === "dark" ? palette.card : palette.accent,
            color: theme === "dark" ? palette.text : "white",
            border: "none",
            borderRadius: "0 8px 8px 0",
            cursor: "pointer",
            fontSize: "0.75rem",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40px",
            minHeight: "40px",
            width: "40px",
            minWidth: "40px",
          }}
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <polyline points='6,9 12,15 18,9'></polyline>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            backgroundColor: palette.card,
            border: `1px solid ${palette.border}`,
            borderRadius: "6px",
            boxShadow: palette.shadow,
            zIndex: 10,
            minWidth: "220px",
          }}
        >
          {exportTypes.map((type) => (
            <div
              key={type.key}
              onClick={() => handleTypeSelect(type.key)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                backgroundColor:
                  selectedType === type.key
                    ? palette.emojiBtnActive
                    : "transparent",
                borderRadius: "6px",
                margin: "4px",
                transition: "background-color 0.2s ease",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    border: `2px solid ${
                      selectedType === type.key
                        ? palette.accent
                        : palette.border
                    }`,
                    backgroundColor:
                      selectedType === type.key
                        ? palette.accent
                        : "transparent",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: palette.text,
                    }}
                  >
                    {type.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: palette.subtext }}>
                    {type.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportSelector;
