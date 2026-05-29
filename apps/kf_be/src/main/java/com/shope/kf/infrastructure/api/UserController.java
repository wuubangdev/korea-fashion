package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateUserRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateUserRequest;
import com.shope.kf.infrastructure.api.dto.response.UserResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.UserUseCase;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.mapper.UserApiMapper;
import com.shope.kf.infrastructure.security.RequireAuth;
import com.shope.kf.infrastructure.security.RoleConstants;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequireAuth
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserUseCase userUseCase;

    public UserController(UserUseCase userUseCase) {
        this.userUseCase = userUseCase;
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) {
        User saved = userUseCase.create(UserApiMapper.toDomain(req));
        return ResponseEntity.ok(UserApiMapper.toResponse(saved));
    }

    @PostMapping("/{id}/copy")
    public ResponseEntity<UserResponse> copy(@PathVariable Long id) {
        User copied = userUseCase.copy(id);
        return ResponseEntity.ok(UserApiMapper.toResponse(copied));
    }

    @GetMapping
    public ResponseEntity<PageResult<UserResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(userUseCase.list(search, PageQuery.of(page, size, sort)).map(UserApiMapper::toResponse));
    }

    @GetMapping("/trash")
    public ResponseEntity<PageResult<UserResponse>> trash(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deletedAt,desc") String sort
    ) {
        return ResponseEntity.ok(userUseCase.trash(search, PageQuery.of(page, size, sort)).map(UserApiMapper::toResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(UserApiMapper.toResponse(userUseCase.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest req) {
        User updated = userUseCase.update(id, UserApiMapper.toDomain(req));
        return ResponseEntity.ok(UserApiMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        userUseCase.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteAll(@RequestBody List<Long> ids) {
        userUseCase.deleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restore(@PathVariable Long id) {
        userUseCase.restore(id);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
    }

    @PostMapping("/trash/restore/bulk")
    public ResponseEntity<ApiResponse<Void>> restoreAll(@RequestBody List<Long> ids) {
        userUseCase.restoreAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
    }

    @RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable Long id) {
        userUseCase.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

    @RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/hard/bulk")
    public ResponseEntity<ApiResponse<Void>> hardDeleteAll(@RequestBody List<Long> ids) {
        userUseCase.hardDeleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

}
