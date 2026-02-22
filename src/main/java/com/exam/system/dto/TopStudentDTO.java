package com.exam.system.dto;

import lombok.Data;

@Data
public class TopStudentDTO {

    private Long studentId;
    private String studentName;
    private String examName;
    private Double score;
    private String status;

    // ⭐ REQUIRED CONSTRUCTOR
    public TopStudentDTO(Long studentId,
            String studentName,
            String examName,
            Double score,
            String status) {

        this.studentId = studentId;
        this.studentName = studentName;
        this.examName = examName;
        this.score = score;
        this.status = status;
    }

    // ===== GETTERS =====

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getExamName() {
        return examName;
    }

    public Double getScore() {
        return score;
    }

    public String getStatus() {
        return status;
    }
}
