package com.shope.kf.infrastructure.persistence;

import com.shope.kf.infrastructure.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

@Component
public class AuditorProvider implements AuditorAware<String> {
    private static final String SYSTEM_USER = "system";

    private final JwtUtil jwtUtil;

    public AuditorProvider(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.of(resolveUsername());
    }

    private String resolveUsername() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (!(attrs instanceof ServletRequestAttributes servletAttrs)) {
            return SYSTEM_USER;
        }
        HttpServletRequest request = servletAttrs.getRequest();
        String header = request.getHeader("Authorization");
        if (header == null || header.isBlank()) {
            return SYSTEM_USER;
        }
        String token = header.startsWith("Bearer ") ? header.substring(7) : header;
        if (!jwtUtil.validateToken(token)) {
            return SYSTEM_USER;
        }
        String username = jwtUtil.extractUsername(token);
        return username == null || username.isBlank() ? SYSTEM_USER : username;
    }
}
