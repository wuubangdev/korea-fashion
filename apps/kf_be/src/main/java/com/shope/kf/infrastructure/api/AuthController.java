package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.AuthUseCase;
import com.shope.kf.infrastructure.api.dto.request.AuthRequest;
import com.shope.kf.infrastructure.api.dto.response.AuthResponse;
import com.shope.kf.infrastructure.api.mapper.AuthApiMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthUseCase authUseCase;

    public AuthController(AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(AuthApiMapper.toResponse(authUseCase.login(AuthApiMapper.toCommand(request))));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(AuthApiMapper.toResponse(authUseCase.register(AuthApiMapper.toCommand(request))));
    }
}
