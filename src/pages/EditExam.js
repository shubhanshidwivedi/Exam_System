import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";  
import { adminAPI } from "../services/api";

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(null);

  useEffect(() => {
  setExam(null);  // Clear previous data
  fetchExam();
}, [id]);

// Add navigation refresh effect
useEffect(() => {
  if (location.state?.refresh) {
    setExam(null);
    fetchExam();
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state?.refresh, location.pathname, navigate]);

  const fetchExam = async () => {
    const res = await adminAPI.getExamById(id);
    setExam(res.data);
  };

  const handleExamChange = (field, value) => {
    setExam({ ...exam, [field]: value });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...exam.questions];
    updated[qIndex][field] = value;
    setExam({ ...exam, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...exam.questions];
    updated[qIndex].options[oIndex][field] = value;

    if (field === "isCorrect" && value && updated[qIndex].type === "SINGLE_CHOICE") {
      updated[qIndex].options.forEach((opt, i) => {
        if (i !== oIndex) opt.isCorrect = false;
      });
    }

    setExam({ ...exam, questions: updated });
  };

  const addOption = (qIndex) => {
    const updated = [...exam.questions];
    updated[qIndex].options.push({ optionText: "", isCorrect: false });
    setExam({ ...exam, questions: updated });
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText: "",
      type: "SINGLE_CHOICE",
      marks: 1,
      orderNumber: exam.questions.length + 1,
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
      ],
    };

    setExam({ ...exam, questions: [...exam.questions, newQuestion] });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formattedQuestions = exam.questions.map((q, i) => ({
        ...q,
        type: q.type?.toUpperCase().replace(" ", "_"),
        orderNumber: i + 1,
      }));

      const payload = {
        ...exam,
        questions: formattedQuestions,
      };

      await adminAPI.updateExam(id, payload);

      alert("Exam updated successfully!");
      navigate("/admin/exams");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update exam");
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="container">
      <h1>Edit Exam</h1>

      <div className="card">
        <input
          className="form-input"
          value={exam.title}
          onChange={(e) => handleExamChange("title", e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="form-textarea"
          value={exam.description || ""}
          onChange={(e) => handleExamChange("description", e.target.value)}
          placeholder="Description"
        />

        <input
          type="number"
          className="form-input"
          value={exam.durationMinutes}
          onChange={(e) => handleExamChange("durationMinutes", +e.target.value)}
        />

        <input
          type="number"
          className="form-input"
          value={exam.totalMarks}
          onChange={(e) => handleExamChange("totalMarks", +e.target.value)}
        />

        <input
          type="number"
          className="form-input"
          value={exam.passingMarks}
          onChange={(e) => handleExamChange("passingMarks", +e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={exam.isActive}
            onChange={(e) => handleExamChange("isActive", e.target.checked)}
          />
          Active Exam
        </label>
      </div>

      <h2>Questions</h2>

      {exam.questions.map((q, qi) => (
        <div key={qi} className="card">
          <textarea
            className="form-textarea"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(qi, "questionText", e.target.value)
            }
          />

          <select
            value={q.type}
            onChange={(e) => handleQuestionChange(qi, "type", e.target.value)}
          >
            <option value="SINGLE_CHOICE">Single Choice</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          </select>

          <input
            type="number"
            value={q.marks}
            onChange={(e) =>
              handleQuestionChange(qi, "marks", +e.target.value)
            }
          />

          <h4>Options</h4>
          {q.options.map((opt, oi) => (
            <div key={oi}>
              <input
                type={q.type === "SINGLE_CHOICE" ? "radio" : "checkbox"}
                checked={opt.isCorrect}
                onChange={(e) =>
                  handleOptionChange(qi, oi, "isCorrect", e.target.checked)
                }
              />
              <input
                value={opt.optionText}
                onChange={(e) =>
                  handleOptionChange(qi, oi, "optionText", e.target.value)
                }
              />
            </div>
          ))}

          <button onClick={() => addOption(qi)}>Add Option</button>
        </div>
      ))}

      <button onClick={addQuestion}>Add Question</button>

      <br /><br />

      <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Update Exam"}
      </button>
    </div>
  );
};

export default EditExam;
