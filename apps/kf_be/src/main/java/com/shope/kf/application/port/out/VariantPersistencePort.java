package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Variant;

import java.util.Optional;

public interface VariantPersistencePort {
    Variant save(Variant variant);
    Optional<Variant> findById(Long id);
    void deleteById(Long id);
    void hardDeleteById(Long id);
    PageResult<Variant> findAll(String search, PageQuery pageQuery);
    PageResult<Variant> findByProduct(Long productId, PageQuery pageQuery);
}
