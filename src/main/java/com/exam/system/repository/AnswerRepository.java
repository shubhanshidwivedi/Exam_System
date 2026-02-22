package com.exam.system.repository;

import com.exam.system.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByExamAttemptId(Long examAttemptId);

    Optional<Answer> findByExamAttemptIdAndQuestionId(Long examAttemptId, Long questionId);

    @Query("""
            SELECT SUM(a.marksObtained)
            FROM Answer a
            WHERE a.examAttempt.id = :attemptId
            """)
    Double calculateTotalMarks(Long attemptId);

}
