package com.exam.system.service;

import com.exam.system.entity.Option;
import com.exam.system.entity.Question;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.*;

@Service
public class QuestionParserService {

    public List<Question> parseQuestions(String text) {

        List<Question> questions = new ArrayList<>();

        // Flexible split: Q1, Question 1, 1), etc
        String[] blocks = text.split("(?i)(?=\\b(Q|Question)?\\s*\\d+[.)])");

        int order = 1;

        for (String block : blocks) {

            if (block.trim().isEmpty())
                continue;

            try {

                Question q = new Question();
                q.setOrderNumber(order++);

                // -------- Marks (optional) ----------
                int marks = 1;
                Matcher marksMatcher = Pattern.compile("(?i)marks\\s*[:=-]?\\s*(\\d+)").matcher(block);
                if (marksMatcher.find())
                    marks = Integer.parseInt(marksMatcher.group(1));

                q.setMarks(marks);

                // -------- Question Text ----------
                String questionText = block
                        .replaceAll("(?i)\\b(Q|Question)?\\s*\\d+[.)]", "")
                        .replaceAll("(?i)marks\\s*[:=-]?\\s*\\d+", "")
                        .split("(?i)\\bA[.)]?\\s")[0]
                        .replaceAll("\\s+", " ")
                        .trim();

                q.setQuestionText(questionText);

                // -------- Extract Options ----------
                Pattern optionPattern = Pattern.compile(
                        "(?i)\\b([A-D])[.)]?\\s*(.*?)(?=\\b[A-D][.)]?\\s|Answer|$)",
                        Pattern.DOTALL);

                Matcher optionMatcher = optionPattern.matcher(block);

                Map<String, String> optionMap = new LinkedHashMap<>();

                while (optionMatcher.find()) {

                    String key = optionMatcher.group(1).toUpperCase();
                    String optText = optionMatcher.group(2);

                    if (optText == null || optText.trim().isEmpty()) {
                        // Try fallback: get text after "A." manually
                        Pattern fallback = Pattern.compile(key + "[.)]?\\s*(.+)");
                        Matcher fb = fallback.matcher(block);
                        if (fb.find()) {
                            optText = fb.group(1);
                        } else {
                            optText = "";
                        }
                    }

                    optText = optText
                            .replaceAll("(?i)answer.*", "")
                            .replaceAll("\\r", "")
                            .replaceAll("\\n+", " ")
                            .replaceAll("\\s+", " ")
                            .trim();

                    optionMap.put(key, optText);
                }

                // Remove empty options (fix first option blank)
                optionMap.entrySet().removeIf(e -> e.getValue().isEmpty());

                // Validation: skip if not enough options
                if (optionMap.size() < 2) {
                    System.out.println("Skipped question (not enough options): "
                            + block.substring(0, Math.min(80, block.length())));
                    continue;
                }

                // -------- Extract Answer ----------
                Set<String> correctAnswers = new HashSet<>();
                Matcher ansMatcher = Pattern.compile(
                        "(?i)answer\\s*[:=-]?\\s*([A-D][.,]?([, ]+[A-D][.,]?)*)")
                        .matcher(block);

                if (ansMatcher.find()) {
                    String[] parts = ansMatcher.group(1).toUpperCase().split(",");
                    for (String p : parts)
                        correctAnswers.add(p.replace(".", "").trim()); // remove dot
                }

                // Validation: skip if no answer
                if (correctAnswers.isEmpty()) {
                    System.out.println("Skipped question (no answer found): "
                            + block.substring(0, Math.min(80, block.length())));
                    continue;
                }

                // -------- Detect Question Type ----------
                if (correctAnswers.size() > 1)
                    q.setType(Question.QuestionType.MULTIPLE_CHOICE);
                else
                    q.setType(Question.QuestionType.SINGLE_CHOICE);

                // -------- Create Options ----------
                List<Option> options = new ArrayList<>();

                for (Map.Entry<String, String> entry : optionMap.entrySet()) {
                    boolean isCorrect = correctAnswers.contains(entry.getKey());
                    options.add(new Option(null, entry.getValue(), isCorrect, q));
                }

                q.setOptions(options);
                questions.add(q);

            } catch (Exception e) {
                System.out.println("Skipped invalid block: "
                        + block.substring(0, Math.min(80, block.length())));
            }
        }

        return questions;
    }
}
