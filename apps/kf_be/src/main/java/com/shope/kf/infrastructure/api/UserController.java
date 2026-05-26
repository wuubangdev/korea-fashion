package com.shope.kf.infrastructure.api;

import com.shope.kf.application.dto.request.CreateUserRequest;
import com.shope.kf.application.dto.request.UpdateUserRequest;
import com.shope.kf.application.dto.response.UserResponse;
import com.shope.kf.application.port.in.UserUseCase;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.api.mapper.UserApiMapper;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping
    public ResponseEntity<Page<UserResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));
        Page<User> users = userUseCase.list(search, pageable);
        List<UserResponse> items = users.stream().map(UserApiMapper::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(items, pageable, users.getTotalElements()));
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
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }

}
