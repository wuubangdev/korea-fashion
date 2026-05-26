package com.shope.kf.infrastructure.api;

import com.shope.kf.application.dto.request.CreateCategoryRequest;
import com.shope.kf.application.dto.request.UpdateCategoryRequest;
import com.shope.kf.application.dto.response.CategoryResponse;
import com.shope.kf.application.port.in.CategoryUseCase;
import com.shope.kf.domain.model.Category;
import com.shope.kf.infrastructure.api.mapper.CategoryApiMapper;
import com.shope.kf.infrastructure.security.RequireAuth;
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
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryUseCase categoryUseCase;

    public CategoryController(CategoryUseCase categoryUseCase) {
        this.categoryUseCase = categoryUseCase;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@jakarta.validation.Valid @RequestBody CreateCategoryRequest req) {
        Category c = CategoryApiMapper.toDomain(req);
        Category saved = categoryUseCase.create(c);
        return ResponseEntity.ok(CategoryApiMapper.toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));
        Page<Category> p = categoryUseCase.list(search, pageable);
        List<CategoryResponse> items = p.stream().map(CategoryApiMapper::toResponse).collect(Collectors.toList());
        Page<CategoryResponse> resp = new PageImpl<>(items, pageable, p.getTotalElements());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> get(@PathVariable Long id) {
        Category c = categoryUseCase.findById(id);
        return ResponseEntity.ok(CategoryApiMapper.toResponse(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateCategoryRequest req) {
        Category c = CategoryApiMapper.toDomain(req);
        Category updated = categoryUseCase.update(id, c);
        return ResponseEntity.ok(CategoryApiMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }

}
