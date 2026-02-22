package com.exam.system.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 Break Attempt <-> Answer loop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_attempt_id", nullable = false)
    @JsonBackReference
    private ExamAttempt examAttempt;

    // Usually we don’t need full question in list response
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private Question question;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "answer_selected_options", joinColumns = @JoinColumn(name = "answer_id"), inverseJoinColumns = @JoinColumn(name = "option_id"))
    @JsonIgnore
    private List<Option> selectedOptions = new ArrayList<>();

    private Boolean isCorrect;
    private Integer marksObtained;
}
