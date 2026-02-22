package com.exam.system.scheduler;

import com.exam.system.service.ExamAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ExamAutoSubmitScheduler {

    @Autowired
    private ExamAttemptService examAttemptService;

    @Scheduled(fixedRate = 30000)
    public void runAutoSubmit() {
        examAttemptService.autoSubmitExpiredAttempts();
    }
}
