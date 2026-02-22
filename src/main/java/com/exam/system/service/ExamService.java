package com.exam.system.service;

import com.exam.system.dto.ExamRequest;
import com.exam.system.entity.Exam;
import com.exam.system.entity.Option;
import com.exam.system.entity.Question;
import com.exam.system.repository.ExamRepository;
import com.exam.system.repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private QuestionRepository questionRepository;

    // ================= CREATE =================
    @Transactional
    public Exam createExam(ExamRequest examRequest) {

        Exam exam = new Exam();

        exam.setTitle(examRequest.getTitle());
        exam.setDescription(examRequest.getDescription());
        exam.setDurationMinutes(examRequest.getDurationMinutes());
        exam.setTotalMarks(examRequest.getTotalMarks());
        exam.setPassingMarks(examRequest.getPassingMarks());
        exam.setStartTime(examRequest.getStartTime());
        exam.setEndTime(examRequest.getEndTime());

        exam.setIsActive(examRequest.getIsActive() != null ? examRequest.getIsActive() : true);
        exam.setShuffleQuestions(examRequest.getShuffleQuestions() != null ? examRequest.getShuffleQuestions() : false);
        exam.setShowResultImmediately(
                examRequest.getShowResultImmediately() != null ? examRequest.getShowResultImmediately() : true);

        if (examRequest.getQuestions() != null) {

            List<Question> questions = new ArrayList<>();

            for (ExamRequest.QuestionRequest qReq : examRequest.getQuestions()) {

                Question question = new Question();
                question.setQuestionText(qReq.getQuestionText());
                question.setType(Question.QuestionType.valueOf(qReq.getType()));
                question.setMarks(qReq.getMarks());
                question.setOrderNumber(qReq.getOrderNumber());
                question.setExam(exam);

                if (qReq.getOptions() != null) {

                    List<Option> options = new ArrayList<>();

                    for (ExamRequest.OptionRequest oReq : qReq.getOptions()) {

                        Option option = new Option();
                        option.setOptionText(oReq.getOptionText());
                        option.setIsCorrect(oReq.getIsCorrect());
                        option.setQuestion(question);

                        options.add(option);
                    }
                    question.setOptions(options);
                }

                questions.add(question);
            }

            exam.setQuestions(questions);
        }

        return examRepository.save(exam);
    }

    // ================= UPDATE =================
    @Transactional
    public Exam updateExam(Long id, ExamRequest examRequest) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        exam.setTitle(examRequest.getTitle());
        exam.setDescription(examRequest.getDescription());
        exam.setDurationMinutes(examRequest.getDurationMinutes());
        exam.setTotalMarks(examRequest.getTotalMarks());
        exam.setPassingMarks(examRequest.getPassingMarks());
        exam.setStartTime(examRequest.getStartTime());
        exam.setEndTime(examRequest.getEndTime());

        exam.setIsActive(examRequest.getIsActive() != null ? examRequest.getIsActive() : exam.getIsActive());
        exam.setShuffleQuestions(examRequest.getShuffleQuestions() != null
                ? examRequest.getShuffleQuestions()
                : exam.getShuffleQuestions());

        exam.setShowResultImmediately(examRequest.getShowResultImmediately() != null
                ? examRequest.getShowResultImmediately()
                : exam.getShowResultImmediately());

        return examRepository.save(exam);
    }

    // ================= GET ALL =================
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    // ================= AVAILABLE FOR STUDENT =================
    public List<Exam> getAvailableExams() {
        return examRepository.findByIsActiveTrue();
    }

    // ================= GET BY ID =================
    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    // ================= DELETE =================
    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    // ================= STATUS CALCULATION =================
    public String calculateStatus(Exam exam) {

        if (exam.getIsActive() == null || !exam.getIsActive()) {
            return "INACTIVE";
        }

        if (exam.getStartTime() == null || exam.getEndTime() == null) {
            return "INACTIVE";
        }

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));

        LocalDateTime start = exam.getStartTime()
                .atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(ZoneId.of("Asia/Kolkata"))
                .toLocalDateTime();

        LocalDateTime end = exam.getEndTime()
                .atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(ZoneId.of("Asia/Kolkata"))
                .toLocalDateTime();

        if (now.isBefore(start)) {
            return "UPCOMING";
        }

        if (now.isAfter(end)) {
            return "EXPIRED";
        }

        return "ACTIVE";
    }

    // ================= STRICT EXAM ACCESS =================
    public void validateExamAccess(Exam exam) {

        if (exam.getIsActive() == null || !exam.getIsActive()) {
            throw new RuntimeException("Exam is inactive");
        }

        if (exam.getStartTime() == null || exam.getEndTime() == null) {
            throw new RuntimeException("Exam schedule not set");
        }

        ZoneId IST = ZoneId.of("Asia/Kolkata");

        LocalDateTime start = exam.getStartTime()
                .atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(IST)
                .toLocalDateTime();

        LocalDateTime end = exam.getEndTime()
                .atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(IST)
                .toLocalDateTime();

        LocalDateTime now = LocalDateTime.now(IST);

        if (now.isBefore(start)) {
            throw new RuntimeException("Exam not started yet");
        }

        if (now.isAfter(end)) {
            throw new RuntimeException("Exam time expired");
        }
    }

    @Transactional
    public Exam createExamFromQuestions(String title, List<Question> questions) {

        Exam exam = new Exam();
        exam.setTitle(title);
        exam.setIsActive(true);

        exam = examRepository.save(exam);

        for (Question q : questions) {
            q.setExam(exam);
        }

        questionRepository.saveAll(questions);

        return exam;
    }

}
