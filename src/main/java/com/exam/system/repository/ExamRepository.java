package com.exam.system.repository;

import com.exam.system.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    // Only active exams
    List<Exam> findByIsActiveTrue();

    // Active + within time range
    List<Exam> findByIsActiveTrueAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            LocalDateTime now1,
            LocalDateTime now2);
}
