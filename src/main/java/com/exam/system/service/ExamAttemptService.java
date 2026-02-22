package com.exam.system.service;

import com.exam.system.dto.SubmitAnswerRequest;
import com.exam.system.entity.*;
import com.exam.system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class ExamAttemptService {

    @Autowired
    private ExamAttemptRepository examAttemptRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    // =====================================================
    // START EXAM
    // =====================================================
    @Transactional
    public ExamAttempt startExam(Long examId, Long studentId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ZoneId IST = ZoneId.of("Asia/Kolkata");

        LocalDateTime now = LocalDateTime.now(IST);

        System.out.println("====== START EXAM DEBUG ======");
        System.out.println("NOW: " + now);
        System.out.println("START: " + exam.getStartTime());
        System.out.println("END: " + exam.getEndTime());
        System.out.println("IS_ACTIVE: " + exam.getIsActive());
        System.out.println("STUDENT_ID: " + studentId);
        System.out.println("EXAM_ID: " + examId);
        System.out.println("==============================");

        LocalDateTime start = exam.getStartTime()
                .atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(IST)
                .toLocalDateTime();

        LocalDateTime end = exam.getEndTime()
                .atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(IST)
                .toLocalDateTime();

        if (now.isBefore(start) || now.isAfter(end)) {
            throw new RuntimeException("Exam is not available at this time");
        }

        if (!Boolean.TRUE.equals(exam.getIsActive())) {
            throw new RuntimeException("Exam is not active");
        }

        // Already attempted
        // ===== Resume running attempt =====
        ExamAttempt running = getActiveAttempt(studentId, examId);
        if (running != null) {
            return running;
        }

        // ===== Prevent multiple attempts =====
        boolean alreadyAttempted = examAttemptRepository
                .existsByStudentIdAndExamIdAndStatusIn(
                        studentId,
                        examId,
                        List.of(
                                ExamAttempt.AttemptStatus.SUBMITTED,
                                ExamAttempt.AttemptStatus.EXPIRED,
                                ExamAttempt.AttemptStatus.EVALUATED));

        if (alreadyAttempted) {
            throw new RuntimeException("You have already attempted this exam");
        }

        // CREATE NEW ATTEMPT
        ExamAttempt attempt = new ExamAttempt();

        attempt.setExam(exam);
        attempt.setStudent(student);

        attempt.setStartedAt(LocalDateTime.now());
        attempt.setExpiresAt(LocalDateTime.now().plusMinutes(exam.getDurationMinutes()));
        attempt.setStatus(ExamAttempt.AttemptStatus.IN_PROGRESS);

        return examAttemptRepository.save(attempt);

    }

    // =====================================================
    // SUBMIT ANSWER
    // =====================================================
    @Transactional
    public Answer submitAnswer(Long attemptId, SubmitAnswerRequest request) {

        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Exam attempt not found"));

        if (attempt.getStatus() != ExamAttempt.AttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Exam is not in progress");
        }

        if (LocalDateTime.now().isAfter(attempt.getExpiresAt())) {
            attempt.setStatus(ExamAttempt.AttemptStatus.EXPIRED);
            examAttemptRepository.save(attempt);
            throw new RuntimeException("Exam time has expired");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = answerRepository
                .findByExamAttemptIdAndQuestionId(attemptId, request.getQuestionId())
                .orElse(new Answer());

        answer.setExamAttempt(attempt);
        answer.setQuestion(question);

        List<Option> selectedOptions = new ArrayList<>();
        for (Long optionId : request.getSelectedOptionIds()) {
            Option option = question.getOptions().stream()
                    .filter(o -> o.getId().equals(optionId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Invalid option ID"));
            selectedOptions.add(option);
        }
        answer.setSelectedOptions(selectedOptions);

        return answerRepository.save(answer);
    }

    // =====================================================
    // SUBMIT EXAM
    // =====================================================
    @Transactional
    public ExamAttempt submitExam(Long attemptId) {

        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Exam attempt not found"));

        if (attempt.getStatus() != ExamAttempt.AttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Exam is not in progress");
        }

        attempt.setSubmittedAt(LocalDateTime.now());

        evaluateExam(attempt);

        attempt.setStatus(ExamAttempt.AttemptStatus.EVALUATED);

        return examAttemptRepository.saveAndFlush(attempt);
    }

    // =====================================================
    // EVALUATE EXAM
    // =====================================================
    private void evaluateExam(ExamAttempt attempt) {

        List<Answer> answers = answerRepository.findByExamAttemptId(attempt.getId());

        int totalScore = 0;

        Set<Long> evaluatedQuestions = new HashSet<>();

        for (Answer answer : answers) {

            Question question = answer.getQuestion();

            if (evaluatedQuestions.contains(question.getId())) {
                continue;
            }
            evaluatedQuestions.add(question.getId());

            List<Option> correctOptions = question.getOptions().stream()
                    .filter(Option::getIsCorrect)
                    .toList();

            List<Option> selectedOptions = answer.getSelectedOptions();

            if (selectedOptions == null || selectedOptions.isEmpty()) {

                answer.setIsCorrect(false);
                answer.setMarksObtained(0);

            } else {

                boolean isCorrect = correctOptions.size() == selectedOptions.size() &&
                        selectedOptions.stream().allMatch(Option::getIsCorrect);

                answer.setIsCorrect(isCorrect);
                answer.setMarksObtained(isCorrect ? question.getMarks() : 0);
            }

            totalScore += answer.getMarksObtained();

            answerRepository.save(answer);

        }

        totalScore = Math.min(totalScore, attempt.getExam().getTotalMarks());

        attempt.setScore(totalScore);
        attempt.setTotalMarks(attempt.getExam().getTotalMarks());
        attempt.setPassed(totalScore >= attempt.getExam().getPassingMarks());
        attempt.setStatus(ExamAttempt.AttemptStatus.EVALUATED);
    }

    // =====================================================
    // GET ATTEMPT
    // =====================================================
    public ExamAttempt getAttempt(Long attemptId) {
        return examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Exam attempt not found"));
    }

    // =====================================================
    // STUDENT ATTEMPTS (WITH EXAM FETCH)
    // =====================================================
    public List<ExamAttempt> getStudentAttempts(Long studentId) {
        return examAttemptRepository.findByStudentIdWithExam(
                studentId,
                ExamAttempt.AttemptStatus.EVALUATED);
    }

    // =====================================================
    public List<ExamAttempt> getExamAttempts(Long examId) {
        return examAttemptRepository.findByExamId(examId);
    }

    // ================= SUBMIT WITH AUTO CHECK =================
    @Transactional
    public ExamAttempt submitExamWithAutoCheck(Long attemptId) {

        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.getStatus() == ExamAttempt.AttemptStatus.EVALUATED) {
            return attempt;
        }

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));

        if (attempt.getExpiresAt() != null && now.isAfter(attempt.getExpiresAt())) {
            attempt.setAutoSubmitted(true);
        }

        attempt.setSubmittedAt(now);

        // ================= CALCULATE SCORE =================
        int totalMarks = attempt.getExam().getTotalMarks();
        int score = calculateScore(attempt);

        attempt.setScore(score);
        attempt.setTotalMarks(totalMarks);
        attempt.setPassed(score >= attempt.getExam().getPassingMarks());

        attempt.setStatus(ExamAttempt.AttemptStatus.EVALUATED);

        return examAttemptRepository.save(attempt);
    }

    // ================= SCORE CALCULATION =================

    // ================= SCORE CALCULATION =================
    private int calculateScore(ExamAttempt attempt) {

        int totalScore = 0;

        for (Answer ans : attempt.getAnswers()) {

            Question q = ans.getQuestion();

            // ================= SINGLE CHOICE =================
            if (q.getType() == Question.QuestionType.SINGLE_CHOICE) {

                Option correct = q.getOptions().stream()
                        .filter(Option::getIsCorrect)
                        .findFirst()
                        .orElse(null);

                if (correct != null
                        && ans.getSelectedOptions() != null
                        && ans.getSelectedOptions().size() == 1
                        && ans.getSelectedOptions().get(0).getId().equals(correct.getId())) {

                    totalScore += q.getMarks();
                }
            }

            // ================= MULTIPLE CHOICE =================
            else if (q.getType() == Question.QuestionType.MULTIPLE_CHOICE) {

                List<Long> correctIds = q.getOptions().stream()
                        .filter(Option::getIsCorrect)
                        .map(Option::getId)
                        .toList();

                List<Long> selectedIds = ans.getSelectedOptions().stream()
                        .map(Option::getId)
                        .toList();

                if (selectedIds.containsAll(correctIds)
                        && correctIds.containsAll(selectedIds)) {

                    totalScore += q.getMarks();
                }
            }
        }

        return totalScore;
    }

    // ================= CHEATING / VIOLATION =================
    @Transactional
    public void logViolation(Long attemptId, String type) {

        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.getStatus() != ExamAttempt.AttemptStatus.IN_PROGRESS) {
            return;
        }

        switch (type) {

            case "TAB_SWITCH" -> {
                int count = attempt.getTabSwitchCount() == null ? 0 : attempt.getTabSwitchCount();
                attempt.setTabSwitchCount(count + 1);
                System.out.println("TAB SWITCH DETECTED → " + attempt.getTabSwitchCount());
            }

            case "FULLSCREEN_EXIT" -> {
                int count = attempt.getFullscreenViolations() == null ? 0 : attempt.getFullscreenViolations();
                attempt.setFullscreenViolations(count + 1);
                System.out.println("FULLSCREEN EXIT DETECTED → " + attempt.getFullscreenViolations());
            }

            case "CAMERA_OFF" -> {
                int count = attempt.getCameraOffViolations() == null ? 0 : attempt.getCameraOffViolations();
                attempt.setCameraOffViolations(count + 1);
                System.out.println("CAMERA OFF DETECTED → " + attempt.getCameraOffViolations());
            }
        }

        int totalViolations = (attempt.getTabSwitchCount() == null ? 0 : attempt.getTabSwitchCount()) +
                (attempt.getFullscreenViolations() == null ? 0 : attempt.getFullscreenViolations()) +
                (attempt.getCameraOffViolations() == null ? 0 : attempt.getCameraOffViolations());

        if (totalViolations >= 3) {
            System.out.println("CHEATING LIMIT EXCEEDED → AUTO SUBMIT");

            attempt.setAutoSubmitted(true);
            attempt.setStatus(ExamAttempt.AttemptStatus.EXPIRED);
            attempt.setSubmittedAt(LocalDateTime.now());

            int score = calculateScore(attempt);
            attempt.setScore(score);
            attempt.setTotalMarks(attempt.getExam().getTotalMarks());
            attempt.setPassed(score >= attempt.getExam().getPassingMarks());
        }

        examAttemptRepository.save(attempt);
    }

    // ================= GET ACTIVE ATTEMPT =================
    public ExamAttempt getActiveAttempt(Long studentId, Long examId) {

        Optional<ExamAttempt> attempt = examAttemptRepository
                .findByStudentIdAndExamIdAndStatus(
                        studentId,
                        examId,
                        ExamAttempt.AttemptStatus.IN_PROGRESS);

        return attempt.orElse(null);
    }

    // ================= AUTO SUBMIT EXPIRED ATTEMPTS =================
    @Transactional
    public void autoSubmitExpiredAttempts() {

        List<ExamAttempt> expiredAttempts = examAttemptRepository.findExpiredAttempts(
                ExamAttempt.AttemptStatus.IN_PROGRESS);

        for (ExamAttempt attempt : expiredAttempts) {

            System.out.println("AUTO SUBMIT (Scheduler) → Attempt " + attempt.getId());

            attempt.setAutoSubmitted(true);
            attempt.setStatus(ExamAttempt.AttemptStatus.EXPIRED);
            attempt.setSubmittedAt(LocalDateTime.now());

            int score = calculateScore(attempt);
            attempt.setScore(score);
            attempt.setTotalMarks(attempt.getExam().getTotalMarks());
            attempt.setPassed(score >= attempt.getExam().getPassingMarks());

            examAttemptRepository.save(attempt);
        }
    }

    public List<Map<String, Object>> getStudentsByExam(Long examId) {

        List<ExamAttempt> attempts = examAttemptRepository.findByExamId(examId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (ExamAttempt a : attempts) {
            Map<String, Object> map = new HashMap<>();
            map.put("studentName", a.getStudent().getFullName());
            map.put("score", a.getScore());
            map.put("passed", a.getPassed());
            result.add(map);
        }

        return result;
    }

}
