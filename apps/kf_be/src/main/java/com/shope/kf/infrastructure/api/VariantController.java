package com.shope.kf.infrastructure.api;

import com.shope.kf.application.dto.request.CreateVariantRequest;
import com.shope.kf.application.dto.request.UpdateVariantRequest;
import com.shope.kf.application.dto.response.VariantResponse;
import com.shope.kf.application.port.in.VariantUseCase;
import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.api.mapper.VariantApiMapper;
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
    public ResponseEntity<Page<VariantResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));
        Page<Variant> p = variantUseCase.list(search, pageable);
        List<VariantResponse> items = p.stream().map(VariantApiMapper::toResponse).collect(Collectors.toList());
        Page<VariantResponse> resp = new PageImpl<>(items, pageable, p.getTotalElements());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<VariantResponse>> listByProduct(@PathVariable Long productId,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
        Page<Variant> p = variantUseCase.listByProduct(productId, PageRequest.of(page, size));
        List<VariantResponse> items = p.stream().map(VariantApiMapper::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(items, PageRequest.of(page, size), p.getTotalElements()));
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
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        variantUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }

}
