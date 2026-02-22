import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentsByExam } from "../services/analyticsService";

const ExamStudentsPage = () => {
  const { examId } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getStudentsByExam(examId);
    setStudents(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Exam Students (PASS / FAIL)</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.studentName}</td>
              <td>{s.score}</td>
              <td style={{ color: s.status === "PASS" ? "green" : "red" }}>
                {s.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamStudentsPage;
