package com.exam.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExamPassFailDTO {

    private Long examId;
    private String examName;
    private Long pass;
    private Long fail;
}
