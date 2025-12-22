package com.distributed.spring_api.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping(value = { "/", "/catalogue", "/profile", "/bookings", "/car/**" })
    public String forwardReact() {
        return "forward:/index.html";
    }
}
