import React from "react";

const AvgScoreCard = ({ avgScore }) => {
  return (
    <div style={{ background: "#f5f5f5", padding: 20, marginBottom: 20 }}>
      <h3>Average Score</h3>
      <h1>{avgScore}</h1>
    </div>
  );
};

export default AvgScoreCard;
