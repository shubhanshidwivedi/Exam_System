package com.exam.system.controller;

import com.exam.system.dto.ApiResponse;
import com.exam.system.dto.ExamRequest;
import com.exam.system.dto.ExamResponse;
import com.exam.system.entity.Exam;
import com.exam.system.entity.ExamAttempt;
import com.exam.system.service.ExamAttemptService;
import com.exam.system.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.exam.system.service.FileParserService;
import com.exam.system.service.QuestionParserService;
import com.exam.system.entity.Question;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamAttemptService examAttemptService;

    @Autowired
    private FileParserService fileParserService;

    @Autowired
    private QuestionParserService questionParserService;

    // ================= CREATE EXAM =================
    @PostMapping("/exams")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createExam(@RequestBody ExamRequest request) {
        try {
            Exam savedExam = examService.createExam(request);

            if (savedExam == null || savedExam.getId() == null) {
                return ResponseEntity.badRequest().body("Exam not saved");
            }

            return ResponseEntity.ok(savedExam);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error while saving exam: " + e.getMessage());
        }
    }

    // ================= UPDATE EXAM =================
    @PutMapping("/exams/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateExam(
            @PathVariable Long id,
            @Valid @RequestBody ExamRequest examRequest) {

        try {
            Exam exam = examService.updateExam(id, examRequest);
            return ResponseEntity.ok(
                    new ApiResponse(true, "Exam updated successfully", exam));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ================= GET ALL EXAMS (WITH STATUS) =================
    @GetMapping("/exams")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllExams() {
        List<ExamResponse> list = examService.getAllExams()
                .stream()
                .map(exam -> {
                    ExamResponse res = new ExamResponse();
                    res.setId(exam.getId());
                    res.setTitle(exam.getTitle());
                    res.setDurationMinutes(exam.getDurationMinutes());
                    res.setTotalMarks(exam.getTotalMarks());
                    res.setIsActive(exam.getIsActive());

                    // AUTO STATUS
                    res.setStatus(examService.calculateStatus(exam));

                    return res;
                })
                .toList();

        return ResponseEntity.ok(list);
    }

    // ================= GET EXAM BY ID =================
    @GetMapping("/exams/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getExamById(@PathVariable Long id) {
        try {
            Exam exam = examService.getExamById(id);
            return ResponseEntity.ok(exam);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ================= DELETE EXAM =================
    @DeleteMapping("/exams/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        try {
            examService.deleteExam(id);
            return ResponseEntity.ok(
                    new ApiResponse(true, "Exam deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ================= GET ATTEMPTS OF EXAM =================
    @GetMapping("/exams/{id}/attempts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getExamAttempts(@PathVariable Long id) {
        List<ExamAttempt> attempts = examAttemptService.getExamAttempts(id);
        return ResponseEntity.ok(attempts);
    }

    @PostMapping("/import-questions")
    public ResponseEntity<?> importQuestions(@RequestParam MultipartFile file) {
        try {
            System.out.println("FILE NAME = " + file.getOriginalFilename());

            String text = fileParserService.extractText(file);
            text = text
                    .replaceAll("\\r", "\n")
                    .replaceAll("\\n+", "\n")
                    .replaceAll("(?m)^([A-D])\\s+", "$1. ")
                    .replaceAll("Q(\\d+)\\s+", "Q$1. ");

            System.out.println("===== EXTRACTED TEXT START =====");
            System.out.println(text);
            System.out.println("===== EXTRACTED TEXT END =====");

            List<Question> questions = questionParserService.parseQuestions(text);

            System.out.println("PARSED QUESTIONS COUNT = " + questions.size());

            if (questions.isEmpty()) {
                return ResponseEntity.badRequest().body("No valid questions found in file");
            }

            return ResponseEntity.ok(questions);

        } catch (Exception e) {
            System.out.println("===== IMPORT ERROR =====");
            e.printStackTrace(); // REAL ERROR
            return ResponseEntity.badRequest().body("Import failed: " + e.getMessage());
        }
    }

}
