package com.shope.kf.application.service;

import com.shope.kf.application.command.AuthCommand;
import com.shope.kf.application.port.out.PasswordHasher;
import com.shope.kf.application.port.out.TokenProvider;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.application.result.AuthResult;
import com.shope.kf.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UserPersistencePort userPort;
    private PasswordHasher passwordHasher;
    private TokenProvider tokenProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userPort = Mockito.mock(UserPersistencePort.class);
        passwordHasher = Mockito.mock(PasswordHasher.class);
        tokenProvider = Mockito.mock(TokenProvider.class);
        when(tokenProvider.generateToken(any(), anySet())).thenReturn("dummytoken");

        authService = new AuthService(userPort, passwordHasher, tokenProvider);
    }

    @Test
    void register_newUser_returnsAuthResponse() {
        AuthCommand command = new AuthCommand("newuser", "pass", null);

        when(userPort.findByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordHasher.hash("pass")).thenReturn("hashed-pass");
        when(userPort.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResult resp = authService.register(command);

        assertNotNull(resp);
        assertEquals("newuser", resp.username());
        assertEquals("dummytoken", resp.token());
    }

    @Test
    void login_validCredentials_returnsToken() {
        AuthCommand command = new AuthCommand("exist", "secret", null);

        User u = User.builder()
                .username("exist")
                .password("hashed-secret")
                .roles(Set.of())
                .build();
        when(userPort.findByUsername("exist")).thenReturn(Optional.of(u));
        when(passwordHasher.matches("secret", "hashed-secret")).thenReturn(true);

        AuthResult resp = authService.login(command);

        assertNotNull(resp);
        assertEquals("exist", resp.username());
        assertEquals("dummytoken", resp.token());
    }
}
