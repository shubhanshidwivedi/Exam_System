package com.exam.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamRequest {

    private String title;

    private String description;

    private Integer durationMinutes;

    private Integer totalMarks;

    private Integer passingMarks;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Boolean isActive = true;

    private Boolean shuffleQuestions = false;

    private Boolean showResultImmediately = true;

    private List<QuestionRequest> questions;

    @Data
    public static class QuestionRequest {

        private String questionText;

        private String type;

        private Integer marks;

        private Integer orderNumber;

        private List<OptionRequest> options;
    }

    @Data
    public static class OptionRequest {

        private String optionText;

        private Boolean isCorrect;
    }
}
