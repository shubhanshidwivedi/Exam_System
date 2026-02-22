import React from "react";

const OverallMetricsCards = ({ data = {} }) => {
  const {
    totalAttempts = 0,
    avgScore = 0,
    highestScore = 0,
    lowestScore = 0,
    passPercent = 0,
    failPercent = 0,
  } = data;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 20,
        marginBottom: 25,
      }}
    >
      <MetricCard title="Total Attempts" value={totalAttempts} color="#4CAF50" />
      <MetricCard
        title="Average Score"
        value={Number(avgScore).toFixed(2)}
        color="#2196F3"
      />
      <MetricCard
        title="Highest Score"
        value={Number(highestScore).toFixed(2)}
        color="#9C27B0"
      />
      <MetricCard
        title="Lowest Score"
        value={Number(lowestScore).toFixed(2)}
        color="#FF9800"
      />
      <MetricCard
        title="Pass %"
        value={`${Number(passPercent).toFixed(1)}%`}
        color="#2E7D32"
      />
      <MetricCard
        title="Fail %"
        value={`${Number(failPercent).toFixed(1)}%`}
        color="#C62828"
      />
    </div>
  );
};

const MetricCard = ({ title, value, color }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        borderLeft: `5px solid ${color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#666",
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          margin: "8px 0 0",
          fontSize: 26,
          fontWeight: 700,
          color: "#222",
        }}
      >
        {value}
      </h2>
    </div>
  );
};

export default OverallMetricsCards;
