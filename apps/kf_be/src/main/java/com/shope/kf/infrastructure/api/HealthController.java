package com.shope.kf.infrastructure.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping
public class HealthController {

    @GetMapping({"/", "/api/health"})
    public Map<String, String> health() {
        return Map.of(
                "service", "Korea Fashion Backend API",
                "status", "UP",
                "documentation", "/swagger-ui/index.html"
        );
    }
}
