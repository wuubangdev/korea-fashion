package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateCategoryRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateCategoryRequest;
import com.shope.kf.infrastructure.api.dto.response.CategoryResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.CategoryUseCase;
import com.shope.kf.domain.model.Category;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.mapper.CategoryApiMapper;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryUseCase categoryUseCase;

    public CategoryController(CategoryUseCase categoryUseCase) {
        this.categoryUseCase = categoryUseCase;
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping
    public ResponseEntity<CategoryResponse> create(@jakarta.validation.Valid @RequestBody CreateCategoryRequest req) {
        Category c = CategoryApiMapper.toDomain(req);
        Category saved = categoryUseCase.create(c);
        return ResponseEntity.ok(CategoryApiMapper.toResponse(saved));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/{id}/copy")
    public ResponseEntity<CategoryResponse> copy(@PathVariable Long id) {
        Category copied = categoryUseCase.copy(id);
        return ResponseEntity.ok(CategoryApiMapper.toResponse(copied));
    }

    @GetMapping
    public ResponseEntity<PageResult<CategoryResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(categoryUseCase.list(search, PageQuery.of(page, size, sort)).map(CategoryApiMapper::toResponse));
    }

    @GetMapping("/trash")
    public ResponseEntity<PageResult<CategoryResponse>> trash(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deletedAt,desc") String sort
    ) {
        return ResponseEntity.ok(categoryUseCase.trash(search, PageQuery.of(page, size, sort)).map(CategoryApiMapper::toResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> get(@PathVariable Long id) {
        Category c = categoryUseCase.findById(id);
        return ResponseEntity.ok(CategoryApiMapper.toResponse(c));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateCategoryRequest req) {
        Category c = CategoryApiMapper.toDomain(req);
        Category updated = categoryUseCase.update(id, c);
        return ResponseEntity.ok(CategoryApiMapper.toResponse(updated));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryUseCase.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteAll(@RequestBody List<Long> ids) {
        categoryUseCase.deleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restore(@PathVariable Long id) {
        categoryUseCase.restore(id);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/trash/restore/bulk")
    public ResponseEntity<ApiResponse<Void>> restoreAll(@RequestBody List<Long> ids) {
        categoryUseCase.restoreAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable Long id) {
        categoryUseCase.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/hard/bulk")
    public ResponseEntity<ApiResponse<Void>> hardDeleteAll(@RequestBody List<Long> ids) {
        categoryUseCase.hardDeleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

}
