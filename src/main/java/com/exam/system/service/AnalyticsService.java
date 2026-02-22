package com.exam.system.service;

import com.exam.system.dto.ExamPassFailDTO;
import com.exam.system.dto.OverallMetricsDTO;
import com.exam.system.dto.StudentExamResultDTO;
import com.exam.system.dto.TopStudentDTO;
import com.exam.system.entity.ExamAttempt;
import com.exam.system.repository.ExamAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ExamAttemptRepository examAttemptRepository;

    // =====================================================
    // AVG SCORE OF EXAM
    // =====================================================
    public Double getAverageScore(Long examId) {

        Double avg = examAttemptRepository.findAverageScore(examId);

        if (avg == null) {
            return 0.0;
        }

        return Math.round(avg * 100.0) / 100.0; // round to 2 decimal
    }

    // =====================================================
    // PASS / FAIL COUNT
    // =====================================================
    public Map<String, Integer> getPassFailStats(Long examId) {

        int pass = examAttemptRepository.countPass(examId);
        int fail = examAttemptRepository.countFail(examId);

        Map<String, Integer> result = new HashMap<>();
        result.put("pass", pass);
        result.put("fail", fail);

        return result;
    }

    // =====================================================
    // TOP 5 STUDENTS (BY SCORE)
    // =====================================================
    public List<TopStudentDTO> getTopStudents(Long examId) {

        List<ExamAttempt> attempts = examAttemptRepository.findTop5ByExam_IdAndStatusInOrderByScoreDesc(
                examId,
                List.of(
                        ExamAttempt.AttemptStatus.SUBMITTED,
                        ExamAttempt.AttemptStatus.EVALUATED));

        return attempts.stream()
                .map(a -> new TopStudentDTO(
                        a.getStudent().getId(),
                        a.getStudent().getFullName(),
                        a.getExam().getTitle(),
                        Double.valueOf(a.getScore()),
                        a.getStatus().name()))
                .toList();
    }

    // =====================================================
    // EXAM-WISE AVG SCORE (FOR BAR CHART)
    // =====================================================
    public Map<Long, Double> getExamWiseAverageScores() {

        List<Object[]> rawData = examAttemptRepository.getExamWiseAvgScore();

        Map<Long, Double> result = new HashMap<>();

        for (Object[] row : rawData) {

            Long examId = (Long) row[0];
            Double avgScore = (Double) row[1];

            if (avgScore == null) {
                avgScore = 0.0;
            }

            avgScore = Math.round(avgScore * 100.0) / 100.0;

            result.put(examId, avgScore);
        }

        return result;
    }

    // ================= OVERALL METRICS =================
    public OverallMetricsDTO getOverallMetrics(Long examId) {

        Long total = examAttemptRepository.countAttempts(examId);
        Double avg = examAttemptRepository.findAverageScore(examId);
        Double high = examAttemptRepository.findHighestScore(examId);
        Double low = examAttemptRepository.findLowestScore(examId);

        int pass = examAttemptRepository.countPass(examId);
        int fail = examAttemptRepository.countFail(examId);

        double passPercent = total == 0 ? 0 : (pass * 100.0) / total;
        double failPercent = total == 0 ? 0 : (fail * 100.0) / total;

        return new OverallMetricsDTO(
                total,
                avg == null ? 0 : avg,
                high == null ? 0 : high,
                low == null ? 0 : low,
                passPercent,
                failPercent);
    }

    // ================= SCORE DISTRIBUTION =================
    public Map<Integer, Long> getScoreDistribution(Long examId) {

        List<Object[]> rows = examAttemptRepository.getScoreDistribution(examId);

        Map<Integer, Long> map = new LinkedHashMap<>();

        for (Object[] r : rows) {
            map.put(
                    ((Number) r[0]).intValue(),
                    ((Number) r[1]).longValue());
        }
        return map;
    }

    // ================= EXAM-WISE PASS FAIL =================
    public List<ExamPassFailDTO> getExamWisePassFail() {
        return examAttemptRepository.getExamWisePassFail();
    }

    // ================= STUDENTS BY EXAM =================
    public List<StudentExamResultDTO> getStudentsByExam(Long examId) {
        return examAttemptRepository.getStudentsByExam(examId);
    }

    // ================= GLOBAL OVERALL =================
    public OverallMetricsDTO getGlobalOverallMetrics() {

        List<ExamAttempt> attempts = examAttemptRepository.findAll();

        long total = attempts.stream().filter(a -> a.getScore() != null).count();

        double avg = attempts.stream()
                .filter(a -> a.getScore() != null)
                .mapToDouble(ExamAttempt::getScore)
                .average()
                .orElse(0);

        double high = attempts.stream()
                .filter(a -> a.getScore() != null)
                .mapToDouble(ExamAttempt::getScore)
                .max()
                .orElse(0);

        double low = attempts.stream()
                .filter(a -> a.getScore() != null)
                .mapToDouble(ExamAttempt::getScore)
                .min()
                .orElse(0);

        long pass = attempts.stream().filter(a -> Boolean.TRUE.equals(a.getPassed())).count();
        long fail = attempts.stream().filter(a -> Boolean.FALSE.equals(a.getPassed())).count();

        double passPercent = total == 0 ? 0 : (pass * 100.0) / total;
        double failPercent = total == 0 ? 0 : (fail * 100.0) / total;

        return new OverallMetricsDTO(total, avg, high, low, passPercent, failPercent);
    }

    public Map<String, Integer> getGlobalPassFail() {

        List<ExamAttempt> attempts = examAttemptRepository.findAll();

        int pass = (int) attempts.stream().filter(a -> Boolean.TRUE.equals(a.getPassed())).count();
        int fail = (int) attempts.stream().filter(a -> Boolean.FALSE.equals(a.getPassed())).count();

        Map<String, Integer> map = new HashMap<>();
        map.put("pass", pass);
        map.put("fail", fail);

        return map;
    }

    public Map<Integer, Long> getGlobalScoreDistribution() {

        List<ExamAttempt> attempts = examAttemptRepository.findAll();

        Map<Integer, Long> map = new TreeMap<>();

        for (ExamAttempt a : attempts) {
            if (a.getScore() != null) {
                map.put(a.getScore(), map.getOrDefault(a.getScore(), 0L) + 1);
            }
        }

        return map;
    }

    // ================= GLOBAL TOP STUDENTS =================
    public List<TopStudentDTO> getGlobalTopStudents() {

        List<ExamAttempt> attempts = examAttemptRepository.findTop5ByStatusInOrderByScoreDesc(
                List.of(
                        ExamAttempt.AttemptStatus.SUBMITTED,
                        ExamAttempt.AttemptStatus.EVALUATED));

        return attempts.stream()
                .map(a -> new TopStudentDTO(
                        a.getStudent().getId(),
                        a.getStudent().getFullName(),
                        a.getExam().getTitle(),
                        a.getScore() == null ? 0.0 : Double.valueOf(a.getScore()),
                        a.getPassed() != null && a.getPassed() ? "PASS" : "FAIL"))
                .toList();
    }

}
