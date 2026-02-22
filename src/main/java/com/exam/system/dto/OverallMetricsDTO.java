package com.exam.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OverallMetricsDTO {

    private Long totalAttempts;
    private Double avgScore;
    private Double highestScore;
    private Double lowestScore;
    private Double passPercent;
    private Double failPercent;
}
