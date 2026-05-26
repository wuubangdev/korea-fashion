package com.shope.kf.infrastructure.security;

import com.shope.kf.application.port.out.TokenProvider;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class JwtTokenProvider implements TokenProvider {
    private final JwtUtil jwtUtil;

    public JwtTokenProvider(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String generateToken(String username, Set<String> roles) {
        return jwtUtil.generateToken(username, roles);
    }
}
