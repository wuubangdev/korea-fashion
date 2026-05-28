package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateProductRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateProductRequest;
import com.shope.kf.infrastructure.api.dto.response.ProductResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.mapper.ProductApiMapper;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

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

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/{id}/copy")
    public ResponseEntity<ProductResponse> copy(@PathVariable Long id) {
        Product copied = productUseCase.copy(id);
        return ResponseEntity.ok(ProductApiMapper.toResponse(copied));
    }

    @GetMapping
    public ResponseEntity<PageResult<ProductResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String brandId,
            @RequestParam(required = false) String collectionId,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean newArrival,
            @RequestParam(required = false) Boolean bestSeller,
            @RequestParam(required = false) Boolean sale,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        ProductFilter filter = new ProductFilter(search, categoryId, brand, brandId, collectionId, gender, style, season, priceMin, priceMax, status, inStock, featured, newArrival, bestSeller, sale);
        return ResponseEntity.ok(productUseCase.list(filter, PageQuery.of(page, size, sort)).map(ProductApiMapper::toResponse));
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
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productUseCase.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteAll(@RequestBody List<Long> ids) {
        productUseCase.deleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable Long id) {
        productUseCase.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/hard/bulk")
    public ResponseEntity<ApiResponse<Void>> hardDeleteAll(@RequestBody List<Long> ids) {
        productUseCase.hardDeleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

}
