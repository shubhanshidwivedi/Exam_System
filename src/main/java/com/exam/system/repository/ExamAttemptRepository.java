package com.exam.system.repository;

import com.exam.system.dto.ExamPassFailDTO;
import com.exam.system.dto.StudentExamResultDTO;
import com.exam.system.entity.ExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {

        // ================= BASIC =================

        List<ExamAttempt> findByExamId(Long examId);

        Optional<ExamAttempt> findByStudentIdAndExamId(Long studentId, Long examId);

        Boolean existsByStudentIdAndExamId(Long studentId, Long examId);

        // ================= FETCH EXAM =================

        @Query("""
                            SELECT ea
                            FROM ExamAttempt ea
                            LEFT JOIN FETCH ea.exam e
                            WHERE ea.student.id = :studentId
                            AND ea.status = :status
                            ORDER BY ea.submittedAt DESC
                        """)
        List<ExamAttempt> findByStudentIdWithExam(
                        @Param("studentId") Long studentId,
                        @Param("status") ExamAttempt.AttemptStatus status);

        // =========================================================
        // ================== ANALYTICS METHODS ===============
        // =========================================================

        // Average Score
        @Query("SELECT AVG(e.score) FROM ExamAttempt e WHERE e.exam.id = :examId AND e.score IS NOT NULL")
        Double findAverageScore(Long examId);

        // Pass Count
        @Query("SELECT COUNT(e) FROM ExamAttempt e WHERE e.exam.id = :examId AND e.passed = true AND e.score IS NOT NULL")
        int countPass(Long examId);

        // Fail Count
        @Query("SELECT COUNT(e) FROM ExamAttempt e WHERE e.exam.id = :examId AND e.passed = false AND e.score IS NOT NULL")
        int countFail(Long examId);

        // Top 5 Students (highest score)
        List<ExamAttempt> findTop5ByExam_IdAndStatusInOrderByScoreDesc(
                        Long examId,
                        List<ExamAttempt.AttemptStatus> status);

        // Exam-wise Average Score (Bar Chart)
        @Query("""
                         SELECT a.exam.id, AVG(a.score)
                         FROM ExamAttempt a
                         GROUP BY a.exam.id
                        """)
        List<Object[]> getExamWiseAvgScore();

        // Total attempts
        @Query("SELECT COUNT(e) FROM ExamAttempt e WHERE e.exam.id = :examId AND e.score IS NOT NULL")
        Long countAttempts(Long examId);

        // Highest score
        @Query("SELECT MAX(a.score) FROM ExamAttempt a WHERE a.exam.id = :examId")
        Double findHighestScore(Long examId);

        // Lowest score
        @Query("SELECT MIN(a.score) FROM ExamAttempt a WHERE a.exam.id = :examId")
        Double findLowestScore(Long examId);

        // Score distribution
        @Query("""
                        SELECT a.score, COUNT(a)
                        FROM ExamAttempt a
                        WHERE a.exam.id = :examId
                        GROUP BY a.score
                        ORDER BY a.score
                        """)
        List<Object[]> getScoreDistribution(Long examId);

        // ================= EXAM-WISE PASS FAIL =================
        @Query("""
                        SELECT new com.exam.system.dto.ExamPassFailDTO(
                            e.id,
                            e.title,
                            SUM(CASE WHEN ea.passed = true THEN 1 ELSE 0 END),
                            SUM(CASE WHEN ea.passed = false THEN 1 ELSE 0 END)
                        )
                        FROM ExamAttempt ea
                        JOIN ea.exam e
                        GROUP BY e.id, e.title
                        """)
        List<ExamPassFailDTO> getExamWisePassFail();

        @Query("""
                        SELECT new com.exam.system.dto.StudentExamResultDTO(
                            ea.student.id,
                            ea.student.fullName,
                            ea.score,
                            CASE WHEN ea.passed = true THEN 'PASS' ELSE 'FAIL' END
                        )
                        FROM ExamAttempt ea
                        WHERE ea.exam.id = :examId
                        """)
        List<StudentExamResultDTO> getStudentsByExam(Long examId);

        List<ExamAttempt> findByStudentId(Long studentId);
        // ================= ACTIVE ATTEMPT =================

        // Student का running attempt
        Optional<ExamAttempt> findByStudentIdAndExamIdAndStatus(
                        Long studentId,
                        Long examId,
                        ExamAttempt.AttemptStatus status);

        // Already submitted attempt check
        Boolean existsByStudentIdAndExamIdAndStatusIn(
                        Long studentId,
                        Long examId,
                        List<ExamAttempt.AttemptStatus> status);

        // ================= AUTO SUBMIT SUPPORT =================

        // Find all expired but not submitted attempts
        @Query("""
                         SELECT a
                         FROM ExamAttempt a
                         WHERE a.status = :status
                         AND a.expiresAt <= CURRENT_TIMESTAMP
                        """)
        List<ExamAttempt> findExpiredAttempts(
                        @Param("status") ExamAttempt.AttemptStatus status);

        // ================= CHEATING TRACK =================

        @Query("""
                         SELECT a
                         FROM ExamAttempt a
                         WHERE a.student.id = :studentId
                         AND a.exam.id = :examId
                        """)
        Optional<ExamAttempt> findAttemptForViolation(Long studentId, Long examId);

        // GLOBAL TOP 5 STUDENTS (ALL EXAMS)
        List<ExamAttempt> findTop5ByStatusInOrderByScoreDesc(
                        List<ExamAttempt.AttemptStatus> status);

}
