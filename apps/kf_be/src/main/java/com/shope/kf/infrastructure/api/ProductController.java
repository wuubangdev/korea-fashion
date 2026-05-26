package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateProductRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateProductRequest;
import com.shope.kf.infrastructure.api.dto.response.ProductResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.api.mapper.ProductApiMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductUseCase productUseCase;

    public ProductController(ProductUseCase productUseCase) {
        this.productUseCase = productUseCase;
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping
    public ResponseEntity<ProductResponse> create(@jakarta.validation.Valid @RequestBody CreateProductRequest req) {
        Product p = ProductApiMapper.toDomain(req);
        Product saved = productUseCase.create(p);
        return ResponseEntity.ok(ProductApiMapper.toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<PageResult<ProductResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(productUseCase.list(search, PageQuery.of(page, size, sort)).map(ProductApiMapper::toResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id) {
        Product p = productUseCase.findById(id);
        return ResponseEntity.ok(ProductApiMapper.toResponse(p));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateProductRequest req) {
        Product p = ProductApiMapper.toDomain(req);
        Product updated = productUseCase.update(id, p);
        return ResponseEntity.ok(ProductApiMapper.toResponse(updated));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }

}
