package com.shope.kf.application.port.in;

import com.shope.kf.domain.model.Variant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VariantUseCase {
    Variant create(Variant variant);
    Variant update(Long id, Variant variant);
    void delete(Long id);
    Variant findById(Long id);
    Page<Variant> list(String search, Pageable pageable);
    Page<Variant> listByProduct(Long productId, Pageable pageable);
}
