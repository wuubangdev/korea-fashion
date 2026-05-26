package com.shope.kf.application.port.in;

import com.shope.kf.application.command.AuthCommand;
import com.shope.kf.application.result.AuthResult;

public interface AuthUseCase {
    AuthResult login(AuthCommand command);
    AuthResult register(AuthCommand command);
}
