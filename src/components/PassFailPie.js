import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

const PassFailPie = ({ passFail }) => {
  const pass = Number(passFail?.pass ?? 0);
  const fail = Number(passFail?.fail ?? 0);

  console.log("PASS FAIL PIE DATA:", pass, fail); // 🔍 Debug

  // If no attempts
  if (pass === 0 && fail === 0) {
    return (
      <p style={{ textAlign: "center", paddingTop: 40 }}>
        No attempts yet
      </p>
    );
  }

  const data = [
    { name: "Pass", value: pass },
    { name: "Fail", value: fail },
  ];

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PassFailPie;
