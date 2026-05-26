package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateUserRequest {
    @Size(max = 50, message = "Username must be at most 50 characters")
    private String username;

    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    @Email(message = "Email is invalid")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    private Set<String> roles;
}
