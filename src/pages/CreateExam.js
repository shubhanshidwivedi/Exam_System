import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const CreateExam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [mode, setMode] = useState("MANUAL"); // ⭐ NEW (MANUAL / IMPORT)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    totalMarks: 100,
    passingMarks: 40,
    startTime: '',
    endTime: '',
    isActive: true,
    shuffleQuestions: false,
    showResultImmediately: true,
  });

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      type: 'SINGLE_CHOICE',
      marks: 1,
      orderNumber: 1,
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
      ],
    },
  ]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // ================= IMPORT PDF =================
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await adminAPI.importQuestions(form);

      if (!res.data || res.data.length === 0) {
        alert("No questions found in file");
        return;
      }

      const normalized = res.data.map(q => ({
  ...q,
  options: q.options.map(opt => ({
    ...opt,
    isCorrect: Boolean(opt.isCorrect)   // ensure boolean
  }))
}));

setQuestions(normalized);

      alert("Questions imported successfully");
      setMode("IMPORT");

    } catch (err) {
    console.error(err);

    if (err.response && err.response.data) {
        alert("Import failed: " + err.response.data);
    } else {
        alert("Import failed: Server error");
    }
} finally {
      setImporting(false);
    }
  };

  // ================= QUESTION HANDLERS =================
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][field] = value;

    if (field === 'isCorrect' && value && newQuestions[qIndex].type === 'SINGLE_CHOICE') {
      newQuestions[qIndex].options.forEach((opt, i) => {
        if (i !== oIndex) opt.isCorrect = false;
      });
    }

    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        type: 'SINGLE_CHOICE',
        marks: 1,
        orderNumber: questions.length + 1,
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
        ],
      },
    ]);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ optionText: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      newQuestions.forEach((q, i) => (q.orderNumber = i + 1));
      setQuestions(newQuestions);
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuestions(newQuestions);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedQuestions = questions.map((q, index) => ({
        ...q,
        type: q.type?.toUpperCase().replace(" ", "_"),
        orderNumber: index + 1,
        options: q.options.map(opt => ({
  optionText: opt.optionText,
  isCorrect: !!opt.isCorrect
        }))
      }));

      const examData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString().slice(0, 19),
        endTime: new Date(formData.endTime).toISOString().slice(0, 19),
        questions: formattedQuestions
      };

      await adminAPI.createExam(examData);
      navigate("/admin/dashboard", { replace: true });

    } catch (error) {
      console.error(error);
      alert("Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="container" style={{ maxWidth: "1000px", margin: "auto" }}>
    <h1 style={{ marginBottom: "20px" }}>Create New Exam</h1>

    {/* ================= IMPORT ================= */}
    <div className="card shadow-sm p-3 mb-4">
      <h4>Import Questions (Optional)</h4>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleImport}
        style={{ marginBottom: "10px" }}
      />

      {importing && <p style={{ color: "#666" }}>Importing questions...</p>}
    </div>

    <form onSubmit={handleSubmit}>

      {/* ================= EXAM DETAILS ================= */}
      <div className="card shadow-sm p-3 mb-4">
        <h3>Exam Details</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          <input
            type="text"
            name="title"
            placeholder="Exam Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="durationMinutes"
            placeholder="Duration (minutes)"
            value={formData.durationMinutes}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            style={{ gridColumn: "1 / span 2" }}
          />

          <input
            type="number"
            name="totalMarks"
            placeholder="Total Marks"
            value={formData.totalMarks}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="passingMarks"
            placeholder="Passing Marks"
            value={formData.passingMarks}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* ================= QUESTIONS ================= */}
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="card shadow-sm p-3 mb-4">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Question {qIndex + 1}</h4>

            {questions.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => removeQuestion(qIndex)}
              >
                Remove
              </button>
            )}
          </div>

          <textarea
            placeholder="Enter question text"
            value={question.questionText}
            onChange={(e) =>
              handleQuestionChange(qIndex, "questionText", e.target.value)
            }
            required
            style={{ marginBottom: "10px" }}
          />

          <input
            type="number"
            placeholder="Marks"
            value={question.marks}
            onChange={(e) =>
              handleQuestionChange(qIndex, "marks", parseInt(e.target.value))
            }
            required
            style={{ marginBottom: "10px" }}
          />

          {/* OPTIONS */}
          {question.options.map((option, oIndex) => (
            <div
              key={oIndex}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <input
  type={question.type === "SINGLE_CHOICE" ? "radio" : "checkbox"}
  name={`correct-${qIndex}`}   // ⭐ ADD THIS LINE (very important)
  checked={option.isCorrect}
  onChange={(e) =>
    handleOptionChange(qIndex, oIndex, "isCorrect", e.target.checked)
  }
/>

              

              <input
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={option.optionText}
                onChange={(e) =>
                  handleOptionChange(
                    qIndex,
                    oIndex,
                    "optionText",
                    e.target.value
                  )
                }
                required
                style={{ flex: 1 }}
              />

              {question.options.length > 2 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeOption(qIndex, oIndex)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => addOption(qIndex)}
          >
            + Add Option
          </button>
        </div>
      ))}

      {/* ================= ACTIONS ================= */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={addQuestion}
        >
          + Add Question
        </button>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Exam"}
        </button>
      </div>
    </form>
  </div>
);
}; 
export default CreateExam;
