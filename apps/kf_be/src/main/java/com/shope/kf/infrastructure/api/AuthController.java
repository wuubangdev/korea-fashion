package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.AuthUseCase;
import com.shope.kf.infrastructure.api.dto.request.AuthRequest;
import com.shope.kf.infrastructure.api.dto.response.AuthResponse;
import com.shope.kf.infrastructure.api.mapper.AuthApiMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "API xác thực người dùng, đăng ký tài khoản và cấp JWT token.")
public class AuthController {

    private final AuthUseCase authUseCase;

    public AuthController(AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    @Operation(
            summary = "Đăng nhập",
            description = """
                    Xác thực username/password và trả về JWT token.

                    Sử dụng token trong Swagger bằng nút Authorize:
                    `Bearer <accessToken>`.
                    """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công"),
            @ApiResponse(responseCode = "400", description = "Request body không hợp lệ", content = @Content),
            @ApiResponse(responseCode = "401", description = "Sai thông tin đăng nhập", content = @Content)
    })
    @PostMapping("/login")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(
                    name = "Tài khoản admin có sẵn",
                    value = """
                            {
                              "username": "admin",
                              "password": "adminpass"
                            }
                            """
            ))
    )
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(AuthApiMapper.toResponse(authUseCase.login(AuthApiMapper.toCommand(request))));
    }

    @Operation(
            summary = "Đăng ký tài khoản khách hàng",
            description = "Tạo user mới với quyền khách hàng mặc định và trả về JWT token để đăng nhập ngay."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đăng ký thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đăng ký không hợp lệ hoặc username đã tồn tại", content = @Content)
    })
    @PostMapping("/register")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(
                    name = "Đăng ký khách hàng",
                    value = """
                            {
                              "username": "swagger-customer",
                              "password": "customerpass",
                              "email": "swagger-customer@example.com"
                            }
                            """
            ))
    )
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(AuthApiMapper.toResponse(authUseCase.register(AuthApiMapper.toCommand(request))));
    }
}
