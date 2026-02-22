import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ScoreDistributionChart = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([range, count]) => ({
    range,
    count,
  }));

  if (chartData.length === 0) {
    return <p>No distribution data</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>   {/* ⭐ HEIGHT FIXED */}
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreDistributionChart;
