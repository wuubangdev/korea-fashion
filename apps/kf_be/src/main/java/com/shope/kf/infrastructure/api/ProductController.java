package com.shope.kf.infrastructure.api;

import com.shope.kf.application.dto.request.CreateProductRequest;
import com.shope.kf.application.dto.request.UpdateProductRequest;
import com.shope.kf.application.dto.response.ProductResponse;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.api.mapper.ProductApiMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shope.kf.infrastructure.security.RequireAuth;

import java.util.List;
import java.util.stream.Collectors;

@RequireAuth
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductUseCase productUseCase;

    public ProductController(ProductUseCase productUseCase) {
        this.productUseCase = productUseCase;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@jakarta.validation.Valid @RequestBody CreateProductRequest req) {
        Product p = ProductApiMapper.toDomain(req);
        Product saved = productUseCase.create(p);
        return ResponseEntity.ok(ProductApiMapper.toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));
        Page<Product> p = productUseCase.list(search, pageable);
        List<ProductResponse> items = p.stream().map(ProductApiMapper::toResponse).collect(Collectors.toList());
        Page<ProductResponse> resp = new PageImpl<>(items, pageable, p.getTotalElements());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id) {
        Product p = productUseCase.findById(id);
        return ResponseEntity.ok(ProductApiMapper.toResponse(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateProductRequest req) {
        Product p = ProductApiMapper.toDomain(req);
        Product updated = productUseCase.update(id, p);
        return ResponseEntity.ok(ProductApiMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }

}
