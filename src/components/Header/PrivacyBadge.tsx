import React from "react";
import { useDashboard } from "../../context/DashboardContext";
import { Lock } from "lucide-react";

const PrivacyBadge: React.FC = () => {
  const { theme, palette } = useDashboard();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        backgroundColor: theme === "dark" ? "#1e2329" : "#f8f9fa",
        border: `1px solid ${palette.border}`,
        borderRadius: "12px",
        fontSize: "0.75rem",
        color: palette.subtext,
        fontWeight: 500,
      }}
    >
      <span>
        <Lock color={palette.subtext} className='w-4 h-4' />
      </span>
      Client-side rendered
    </div>
  );
};

export default PrivacyBadge;
