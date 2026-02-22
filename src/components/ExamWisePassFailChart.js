import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const ExamWisePassFailChart = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = (state) => {
    const examId = state?.activePayload?.[0]?.payload?.examId;
    if (examId) {
      navigate(`/admin/exam-students/${examId}`);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} onClick={handleClick}>
        <XAxis dataKey="examName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pass" fill="#4caf50" />
        <Bar dataKey="fail" fill="#f44336" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExamWisePassFailChart;
