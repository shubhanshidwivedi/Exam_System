package com.exam.system.controller;

import com.exam.system.dto.ApiResponse;
import com.exam.system.dto.ExamResponse;
import com.exam.system.dto.SubmitAnswerRequest;
import com.exam.system.entity.*;
import com.exam.system.service.ExamAttemptService;
import com.exam.system.service.ExamService;
import com.exam.system.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamAttemptService examAttemptService;

    @Autowired
    private UserService userService;

    // =====================================================
    // DASHBOARD
    // =====================================================
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getDashboard(Authentication authentication) {

        String username = authentication.getName();
        User student = userService.findByUsername(username);

        // ===== AVAILABLE EXAMS =====
        List<ExamResponse> availableExams = examService.getAllExams()
                .stream()
                .filter(e -> {
                    String status = examService.calculateStatus(e);
                    return status.equals("ACTIVE") || status.equals("UPCOMING");
                })
                .map(exam -> {
                    ExamResponse res = new ExamResponse();
                    res.setId(exam.getId());
                    res.setTitle(exam.getTitle());
                    res.setDurationMinutes(exam.getDurationMinutes());
                    res.setTotalMarks(exam.getTotalMarks());
                    res.setIsActive(exam.getIsActive());
                    res.setStatus(examService.calculateStatus(exam));
                    return res;
                })
                .toList();

        // ===== MY ATTEMPTS =====
        List<Map<String, Object>> myAttempts = examAttemptService
                .getStudentAttempts(student.getId())
                .stream()
                .map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", a.getId());
                    map.put("score", a.getScore());
                    map.put("totalMarks", a.getTotalMarks());
                    map.put("passed", a.getPassed());
                    map.put("submittedAt", a.getSubmittedAt());
                    map.put("examId", a.getExam().getId());
                    map.put("examTitle", a.getExam().getTitle());
                    return map;
                })
                .toList();

        Map<String, Object> data = new HashMap<>();
        data.put("availableExams", availableExams);
        data.put("myAttempts", myAttempts);

        return ResponseEntity.ok(new ApiResponse(true, "Dashboard loaded", data));
    }

    // =====================================================
    // AVAILABLE EXAMS
    // =====================================================
    @GetMapping("/exams")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getAvailableExams() {

        List<ExamResponse> list = examService.getAvailableExams()
                .stream()
                .map(exam -> {
                    ExamResponse res = new ExamResponse();
                    res.setId(exam.getId());
                    res.setTitle(exam.getTitle());
                    res.setDurationMinutes(exam.getDurationMinutes());
                    res.setStartTime(exam.getStartTime());
                    res.setEndTime(exam.getEndTime());
                    res.setTotalMarks(exam.getTotalMarks());
                    res.setIsActive(exam.getIsActive());
                    res.setStatus(examService.calculateStatus(exam));
                    return res;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // =====================================================
    // START EXAM
    // =====================================================
    @PostMapping("/exams/{examId}/start")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> startExam(@PathVariable Long examId,
            Authentication authentication) {

        String username = authentication.getName();
        User student = userService.findByUsername(username);

        Exam exam = examService.getExamById(examId);
        examService.validateExamAccess(exam);

        ExamAttempt attempt = examAttemptService.startExam(examId, student.getId());

        List<Map<String, Object>> questions = exam.getQuestions()
                .stream()
                .map(this::sanitizeQuestion)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("attemptId", attempt.getId());
        response.put("expiresAt", attempt.getExpiresAt());
        response.put("questions", questions);

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // SUBMIT ANSWER
    // =====================================================
    @PostMapping("/attempts/{attemptId}/answer")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitAnswer(
            @PathVariable Long attemptId,
            @Valid @RequestBody SubmitAnswerRequest request) {

        examAttemptService.submitAnswer(attemptId, request);
        return ResponseEntity.ok(new ApiResponse(true, "Answer submitted"));
    }

    // =====================================================
    // SUBMIT EXAM (🔥 ALWAYS EVALUATES)
    // =====================================================
    @PostMapping("/attempts/{attemptId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitExam(@PathVariable Long attemptId) {

        ExamAttempt attempt = examAttemptService.submitExam(attemptId);

        Map<String, Object> result = new HashMap<>();
        result.put("score", attempt.getScore());
        result.put("totalMarks", attempt.getTotalMarks());
        result.put("passed", attempt.getPassed());
        result.put("submittedAt", attempt.getSubmittedAt());

        return ResponseEntity.ok(result);
    }

    // =====================================================
    // MY ATTEMPTS (RESULT PAGE)
    // =====================================================
    @GetMapping("/my-attempts")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyAttempts(Authentication authentication) {

        String username = authentication.getName();
        User student = userService.findByUsername(username);

        List<ExamAttempt> attempts = examAttemptService.getStudentAttempts(student.getId());

        List<Map<String, Object>> response = attempts.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("score", a.getScore());
            map.put("totalMarks", a.getTotalMarks());
            map.put("passed", a.getPassed());
            map.put("submittedAt", a.getSubmittedAt());
            map.put("examTitle", a.getExam().getTitle());
            map.put("examId", a.getExam().getId());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // CHEATING / VIOLATION
    // =====================================================
    @PostMapping("/attempts/{attemptId}/violation")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> logViolation(@PathVariable Long attemptId,
            @RequestParam String type) {

        examAttemptService.logViolation(attemptId, type);
        return ResponseEntity.ok(new ApiResponse(true, "Violation logged"));
    }

    // =====================================================
    // SANITIZE QUESTION
    // =====================================================
    private Map<String, Object> sanitizeQuestion(Question question) {

        Map<String, Object> qMap = new HashMap<>();
        qMap.put("id", question.getId());
        qMap.put("questionText", question.getQuestionText());
        qMap.put("type", question.getType());
        qMap.put("marks", question.getMarks());

        List<Map<String, Object>> options = question.getOptions().stream()
                .map(option -> {
                    Map<String, Object> oMap = new HashMap<>();
                    oMap.put("id", option.getId());
                    oMap.put("optionText", option.getOptionText());
                    return oMap;
                })
                .toList();

        qMap.put("options", options);
        return qMap;
    }
}
