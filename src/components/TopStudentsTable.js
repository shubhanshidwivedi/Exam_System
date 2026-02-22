import React from "react";

const TopStudentsTable = ({ students }) => {
  return (
    <div style={{ marginTop: 30 }}>
      <h3>🏆 Top Students</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.student?.id}</td>
              <td>{s.score}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopStudentsTable;
