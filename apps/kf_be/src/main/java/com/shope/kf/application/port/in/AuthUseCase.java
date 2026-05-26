package com.shope.kf.application.port.in;

import com.shope.kf.application.dto.request.AuthRequest;
import com.shope.kf.application.dto.response.AuthResponse;

public interface AuthUseCase {
    AuthResponse login(AuthRequest request);
    AuthResponse register(AuthRequest request);
}
