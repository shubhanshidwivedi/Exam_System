package com.exam.system.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exam_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= STUDENT =================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private User student;

    // ================= EXAM =================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonBackReference
    private Exam exam;

    // ================= TIME =================
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime startedAt;

    private LocalDateTime submittedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // ================= STATUS =================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptStatus status;

    // ================= RESULT =================
    private Integer score;
    private Integer totalMarks;
    private Boolean passed;

    // ================= AUTO SUBMIT =================
    @Column(nullable = false)
    private Boolean autoSubmitted = false;

    // ================= ANTI CHEAT =================
    private Integer tabSwitchCount = 0;
    private Integer fullscreenViolations = 0;
    private Integer cameraOffViolations = 0;

    // ================= ANSWERS =================
    @OneToMany(mappedBy = "examAttempt", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Answer> answers = new ArrayList<>();

    // ================= ENUM =================
    public enum AttemptStatus {
        IN_PROGRESS,
        SUBMITTED,
        EXPIRED,
        EVALUATED
    }
}
