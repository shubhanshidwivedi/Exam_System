package com.exam.system.controller;

import com.exam.system.dto.*;
import com.exam.system.service.AnalyticsService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor

public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // =====================================================
    // ================= GLOBAL ANALYTICS ==================
    // =====================================================

    // GLOBAL OVERALL
    @GetMapping("/overall")
    @PreAuthorize("hasRole('ADMIN')")
    public OverallMetricsDTO getGlobalOverall() {
        return analyticsService.getGlobalOverallMetrics();
    }

    // GLOBAL PASS FAIL
    @GetMapping("/pass-fail")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Integer> getGlobalPassFail() {
        return analyticsService.getGlobalPassFail();
    }

    // GLOBAL SCORE DISTRIBUTION
    @GetMapping("/score-distribution")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<Integer, Long> getGlobalScoreDistribution() {
        return analyticsService.getGlobalScoreDistribution();
    }

    // GLOBAL TOP STUDENTS
    @GetMapping("/top-students")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TopStudentDTO> getGlobalTopStudents() {
        return analyticsService.getGlobalTopStudents();
    }

    // =====================================================
    // ================= PER EXAM ANALYTICS ================
    // =====================================================

    // AVG SCORE OF EXAM
    @GetMapping("/avg-score/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Double getAverageScore(@PathVariable Long examId) {
        return analyticsService.getAverageScore(examId);
    }

    // PASS FAIL OF EXAM
    @GetMapping("/pass-fail/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Integer> getPassFailStats(@PathVariable Long examId) {
        return analyticsService.getPassFailStats(examId);
    }

    // TOP STUDENTS OF EXAM
    @GetMapping("/top-students/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TopStudentDTO> getTopStudents(@PathVariable Long examId) {
        return analyticsService.getTopStudents(examId);
    }

    // OVERALL METRICS OF EXAM
    @GetMapping("/overall/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public OverallMetricsDTO getOverall(@PathVariable Long examId) {
        return analyticsService.getOverallMetrics(examId);
    }

    // SCORE DISTRIBUTION OF EXAM
    @GetMapping("/score-distribution/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<Integer, Long> getScoreDist(@PathVariable Long examId) {
        return analyticsService.getScoreDistribution(examId);
    }

    // =====================================================
    // ================= COMMON ANALYTICS ==================
    // =====================================================

    // EXAM-WISE PASS FAIL (Bar Chart)
    @GetMapping("/pass-fail-exam-wise")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ExamPassFailDTO> getExamWisePassFail() {
        return analyticsService.getExamWisePassFail();
    }

    // STUDENTS BY EXAM
    @GetMapping("/students-by-exam/{examId}")
    public List<StudentExamResultDTO> getStudentsByExam(@PathVariable Long examId) {
        return analyticsService.getStudentsByExam(examId);
    }
}
