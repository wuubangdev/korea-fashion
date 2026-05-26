package com.shope.kf.application.mapper;

import com.shope.kf.application.dto.request.AuthRequest;
import com.shope.kf.application.dto.response.AuthResponse;
import com.shope.kf.domain.model.Role;
import com.shope.kf.domain.model.User;

import java.util.Collections;

public final class AuthMapper {
    private AuthMapper() {
    }

    public static User toRegisteredUser(AuthRequest request, String encodedPassword) {
        return User.builder()
                .username(request.getUsername())
                .password(encodedPassword)
                .email(request.getEmail())
                .roles(Collections.singleton(new Role(null, "ROLE_USER")))
                .build();
    }

    public static AuthResponse toResponse(User user, String token) {
        return new AuthResponse(user.getUsername(), token);
    }
}
