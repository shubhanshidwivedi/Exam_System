package com.exam.system.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactForwardController {

    // Forward ONLY frontend routes (NOT API)
    @RequestMapping(value = {
            "/",
            "/login",
            "/register",
            "/admin",
            "/student",
            "/admin/**",
            "/student/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
