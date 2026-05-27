package com.shope.kf.application.mapper;

import com.shope.kf.application.command.AuthCommand;
import com.shope.kf.application.result.AuthResult;
import com.shope.kf.domain.model.Role;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.security.RoleConstants;

import java.util.Collections;

public final class AuthMapper {
    private AuthMapper() {
    }

    public static User toRegisteredUser(AuthCommand command, String encodedPassword) {
        return User.builder()
                .username(command.username())
                .password(encodedPassword)
                .email(command.email())
                .roles(Collections.singleton(new Role(null, RoleConstants.ROLE_CUSTOMER)))
                .build();
    }

    public static AuthResult toResult(User user, String token) {
        return new AuthResult(user.getUsername(), token);
    }
}
