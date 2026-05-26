package com.shope.kf.application.service;

import com.shope.kf.application.command.AuthCommand;
import com.shope.kf.application.mapper.AuthMapper;
import com.shope.kf.application.port.in.AuthUseCase;
import com.shope.kf.application.port.out.PasswordHasher;
import com.shope.kf.application.port.out.TokenProvider;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.application.result.AuthResult;
import com.shope.kf.domain.model.Role;
import com.shope.kf.domain.model.User;

import java.util.Set;
import java.util.stream.Collectors;

public class AuthService implements AuthUseCase {

    private final UserPersistencePort userPort;
    private final PasswordHasher passwordHasher;
    private final TokenProvider tokenProvider;

    public AuthService(UserPersistencePort userPort, PasswordHasher passwordHasher, TokenProvider tokenProvider) {
        this.userPort = userPort;
        this.passwordHasher = passwordHasher;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResult login(AuthCommand command) {
        return userPort.findByUsername(command.username())
                .map(u -> {
                    if (!passwordHasher.matches(command.password(), u.getPassword())) {
                        throw new RuntimeException("Invalid credentials");
                    }
                    String token = tokenProvider.generateToken(u.getUsername(), roleNames(u));
                    return AuthMapper.toResult(u, token);
                }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public AuthResult register(AuthCommand command) {
        if (userPort.findByUsername(command.username()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User toSave = AuthMapper.toRegisteredUser(command, passwordHasher.hash(command.password()));

        User saved = userPort.save(toSave);
        String token = tokenProvider.generateToken(saved.getUsername(), roleNames(saved));
        return AuthMapper.toResult(saved, token);
    }

    private Set<String> roleNames(User user) {
        if (user.getRoles() == null) {
            return Set.of();
        }
        return user.getRoles().stream()
                .map(Role::getName)
                .filter(name -> name != null && !name.isBlank())
                .collect(Collectors.toUnmodifiableSet());
    }
}
