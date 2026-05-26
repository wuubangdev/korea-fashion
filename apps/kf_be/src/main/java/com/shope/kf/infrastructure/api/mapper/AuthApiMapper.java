package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.application.command.AuthCommand;
import com.shope.kf.application.result.AuthResult;
import com.shope.kf.infrastructure.api.dto.request.AuthRequest;
import com.shope.kf.infrastructure.api.dto.response.AuthResponse;

public final class AuthApiMapper {
    private AuthApiMapper() {
    }

    public static AuthCommand toCommand(AuthRequest request) {
        return new AuthCommand(request.getUsername(), request.getPassword(), request.getEmail());
    }

    public static AuthResponse toResponse(AuthResult result) {
        return new AuthResponse(result.username(), result.token());
    }
}
