package com.exam.system.dto;

public class StudentExamResultDTO {

    private Long studentId;
    private String studentName;
    private Double score;
    private String result; // PASS / FAIL

    public StudentExamResultDTO(Long studentId, String studentName, Double score, String result) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.score = score;
        this.result = result;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Double getScore() {
        return score;
    }

    public String getResult() {
        return result;
    }
}
