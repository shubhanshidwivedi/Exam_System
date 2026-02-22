import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const ExamWiseBar = ({ data, onBarClick }) => {

  const handleClick = (entry) => {
    if (!entry || !onBarClick) return;
    onBarClick(entry.examId);   // 🔥 send examId to parent
  };

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="examName" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          {/* PASS BAR */}
          <Bar
            dataKey="pass"
            fill="#4caf50"
            cursor="pointer"
            onClick={(data, index) => handleClick(data)}
          />

          {/* FAIL BAR */}
          <Bar
            dataKey="fail"
            fill="#f44336"
            cursor="pointer"
            onClick={(data, index) => handleClick(data)}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExamWiseBar;
