import React from "react";
import { useDashboard } from "../../context/DashboardContext";
import TimeRangeSelector from "./TimeRangeSelector";
import ExportSelector from "./ExportSelector";
import ThemeToggle from "./ThemeToggle";
import PrivacyBadge from "./PrivacyBadge";

const Header: React.FC = () => {
  const {
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    theme,
    palette,
    lastUpdate,
    now,
    dataUpdateIndicator,
    handleCsvExport,
  } = useDashboard();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <span
            className={`stream-dot ${
              dataUpdateIndicator ? "data-update-flash" : ""
            }`}
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: dataUpdateIndicator
                ? "#4ade80"
                : theme === "dark"
                ? "#4f8cff"
                : "#007bff",
              boxShadow: `0 0 0 0 ${
                dataUpdateIndicator
                  ? "rgba(74,222,128,0.6)"
                  : theme === "dark"
                  ? "rgba(79,140,255,0.5)"
                  : "rgba(0,123,255,0.4)"
              }`,
              marginRight: 4,
              verticalAlign: "middle",
              animation: dataUpdateIndicator
                ? "data-flash 0.5s ease-in-out"
                : "pulse-dot 1.2s infinite",
              transition: "all 0.3s ease",
            }}
          />
          <span
            style={{
              color: dataUpdateIndicator
                ? palette.sentiment.positive
                : palette.subtext,
              fontSize: "0.98rem",
              fontWeight: dataUpdateIndicator ? 600 : 500,
              transition: "all 0.3s ease",
            }}
          >
            {dataUpdateIndicator
              ? "Live data updated!"
              : `Last updated ${Math.max(
                  0,
                  Math.floor((now.getTime() - lastUpdate.getTime()) / 1000)
                )}s ago`}
          </span>
        </div>
        <PrivacyBadge />
      </div>

      <header
        style={{
          marginBottom: "15px",
          borderBottom: `1px solid ${palette.border}`,
          paddingBottom: "15px",
          background:
            theme === "dark" ? palette.header : "rgba(255,255,255,0.7)",
          backdropFilter: theme === "dark" ? "none" : "blur(12px)",
          WebkitBackdropFilter: theme === "dark" ? "none" : "blur(12px)",
          borderRadius: "20px",
          boxShadow:
            theme === "dark"
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.18)"
              : "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
          marginTop: "15px",
          paddingTop: "20px",
          paddingLeft: "28px",
          paddingRight: "28px",
          animation: "header-fade-in 0.8s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          overflow: "visible",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "18px",
            position: "relative",
          }}
        >
          <span
            className='dashboard-logo-spin'
            style={{
              fontSize: "2rem",
              marginRight: "0.6rem",
              color: palette.accent,
              filter: "drop-shadow(0 2px 8px #3b82f650)",
            }}
          >
            <svg
              width='38'
              height='38'
              viewBox='0 0 38 38'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='19'
                cy='19'
                r='18'
                stroke={palette.accent}
                strokeWidth='2'
                fill='url(#headerLogoGradient)'
              />
              <defs>
                <radialGradient
                  id='headerLogoGradient'
                  cx='50%'
                  cy='50%'
                  r='50%'
                >
                  <stop offset='0%' stopColor='#fff' stopOpacity='0.7' />
                  <stop offset='100%' stopColor='#3b82f6' stopOpacity='0.2' />
                </radialGradient>
              </defs>
            </svg>
          </span>
          <h1
            style={{
              textAlign: "center",
              margin: 0,
              color: palette.text,
              fontWeight: 800,
              fontSize: "2.4rem",
              letterSpacing: "-0.03em",
              background: "linear-gradient(90deg, #3b82f6 30%, #4ade80 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",
              display: "inline-block",
              zIndex: 1,
              animation: "title-slide-in 1.1s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            Social Media Sentiment Dashboard
            <span
              className='title-underline-anim'
              style={{
                display: "block",
                height: "4px",
                width: "100%",
                background: "linear-gradient(90deg, #3b82f6 30%, #4ade80 70%)",
                borderRadius: "2px",
                marginTop: "6px",
                opacity: 0.7,
                animation:
                  "underline-grow 1.2s cubic-bezier(0.4,0,0.2,1) 0.5s both",
              }}
            />
          </h1>
        </div>
        <div
          className='header-controls'
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.2rem",
          }}
        >
          <TimeRangeSelector
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
          />
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <ExportSelector onExport={handleCsvExport} />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
