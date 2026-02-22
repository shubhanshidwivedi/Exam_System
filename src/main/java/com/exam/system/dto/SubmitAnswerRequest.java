package com.exam.system.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitAnswerRequest {
    
    @NotNull(message = "Question ID is required")
    private Long questionId;
    
    @NotNull(message = "Selected options are required")
    private List<Long> selectedOptionIds;
}
