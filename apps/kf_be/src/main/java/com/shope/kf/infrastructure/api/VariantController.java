package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateVariantRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateVariantRequest;
import com.shope.kf.infrastructure.api.dto.response.VariantResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.VariantUseCase;
import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.mapper.VariantApiMapper;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequireAuth
@RestController
@RequestMapping("/api/variants")
public class VariantController {

    private final VariantUseCase variantUseCase;

    public VariantController(VariantUseCase variantUseCase) {
        this.variantUseCase = variantUseCase;
    }

    @PostMapping
    public ResponseEntity<VariantResponse> create(@jakarta.validation.Valid @RequestBody CreateVariantRequest req) {
        Variant v = VariantApiMapper.toDomain(req);
        Variant saved = variantUseCase.create(v);
        return ResponseEntity.ok(VariantApiMapper.toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<PageResult<VariantResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(variantUseCase.list(search, PageQuery.of(page, size, sort)).map(VariantApiMapper::toResponse));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<PageResult<VariantResponse>> listByProduct(@PathVariable Long productId,
                                                                     @RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int size,
                                                                     @RequestParam(defaultValue = "id,desc") String sort) {
        return ResponseEntity.ok(variantUseCase.listByProduct(productId, PageQuery.of(page, size, sort)).map(VariantApiMapper::toResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VariantResponse> get(@PathVariable Long id) {
        Variant v = variantUseCase.findById(id);
        return ResponseEntity.ok(VariantApiMapper.toResponse(v));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VariantResponse> update(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateVariantRequest req) {
        Variant v = VariantApiMapper.toDomain(req);
        Variant updated = variantUseCase.update(id, v);
        return ResponseEntity.ok(VariantApiMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        variantUseCase.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable Long id) {
        variantUseCase.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

}
