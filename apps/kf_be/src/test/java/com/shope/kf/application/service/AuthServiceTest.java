package com.shope.kf.application.service;

import com.shope.kf.application.dto.request.AuthRequest;
import com.shope.kf.application.dto.response.AuthResponse;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UserPersistencePort userPort;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userPort = Mockito.mock(UserPersistencePort.class);
        passwordEncoder = new BCryptPasswordEncoder();
        jwtUtil = Mockito.mock(JwtUtil.class);
        when(jwtUtil.generateToken(any())).thenReturn("dummytoken");

        authService = new AuthService(userPort, passwordEncoder, jwtUtil);
    }

    @Test
    void register_newUser_returnsAuthResponse() {
        AuthRequest req = new AuthRequest();
        req.setUsername("newuser");
        req.setPassword("pass");

        when(userPort.findByUsername("newuser")).thenReturn(Optional.empty());
        when(userPort.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("newuser", resp.getUsername());
        assertEquals("dummytoken", resp.getToken());
    }

    @Test
    void login_validCredentials_returnsToken() {
        AuthRequest req = new AuthRequest();
        req.setUsername("exist");
        req.setPassword("secret");

        User u = User.builder().username("exist").password(passwordEncoder.encode("secret")).build();
        when(userPort.findByUsername("exist")).thenReturn(Optional.of(u));

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("exist", resp.getUsername());
        assertEquals("dummytoken", resp.getToken());
    }
}
