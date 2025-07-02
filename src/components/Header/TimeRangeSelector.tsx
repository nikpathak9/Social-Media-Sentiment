import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

interface TimeRangeSelectorProps {
  startTime: Date;
  endTime: Date;
  onStartTimeChange: (date: Date) => void;
  onEndTimeChange: (date: Date) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  onStartTimeChange,
  onEndTimeChange,
}) => {
  const { palette } = useDashboard();
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");

  const presets = [
    { key: "hour", label: "Last hour", hours: 1 },
    { key: "24h", label: "Last 24 hours", hours: 24 },
    { key: "7d", label: "Last 7 days", hours: 24 * 7 },
    { key: "custom", label: "Custom", hours: 0 },
  ];

  const handlePresetChange = (preset: (typeof presets)[0]) => {
    setSelectedPreset(preset.key);
    if (preset.key !== "custom") {
      const now = new Date();
      const start = new Date(now.getTime() - preset.hours * 60 * 60 * 1000);
      onStartTimeChange(start);
      onEndTimeChange(now);
    }
  };

  return (
    <div
      className='time-range-controls'
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() => handlePresetChange(preset)}
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              borderWidth: selectedPreset === preset.key ? "2px" : "1px",
              borderStyle: "solid",
              borderColor:
                selectedPreset === preset.key ? palette.accent : palette.border,
              backgroundColor:
                selectedPreset === preset.key
                  ? palette.emojiBtnActive
                  : palette.emojiBtn,
              color: selectedPreset === preset.key ? "white" : palette.text,
              cursor: "pointer",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              fontWeight: selectedPreset === preset.key ? 600 : 400,
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;
