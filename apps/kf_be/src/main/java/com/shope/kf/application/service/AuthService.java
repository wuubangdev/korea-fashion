package com.shope.kf.application.service;

import com.shope.kf.application.dto.request.AuthRequest;
import com.shope.kf.application.dto.response.AuthResponse;
import com.shope.kf.application.mapper.AuthMapper;
import com.shope.kf.application.port.in.AuthUseCase;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements AuthUseCase {

    private final UserPersistencePort userPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserPersistencePort userPort, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userPort = userPort;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        return userPort.findByUsername(request.getUsername())
                .map(u -> {
                    if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
                        throw new RuntimeException("Invalid credentials");
                    }
                    String token = jwtUtil.generateToken(u.getUsername());
                    return AuthMapper.toResponse(u, token);
                }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public AuthResponse register(AuthRequest request) {
        if (userPort.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User toSave = AuthMapper.toRegisteredUser(request, passwordEncoder.encode(request.getPassword()));

        User saved = userPort.save(toSave);
        String token = jwtUtil.generateToken(saved.getUsername());
        return AuthMapper.toResponse(saved, token);
    }
}
