package com.exam.system.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ExamResponse {

    private Long id;
    private String title;
    private Integer durationMinutes;
    private Integer totalMarks;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Boolean isActive; // admin toggle
    private String status; // UPCOMING / ACTIVE / EXPIRED / INACTIVE
}
