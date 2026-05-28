package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Variant;

import java.util.List;
import java.util.Optional;

public interface VariantPersistencePort {
    Variant save(Variant variant);
    Optional<Variant> findById(Long id);
    void deleteById(Long id);
    void deleteAllById(List<Long> ids);
    void hardDeleteById(Long id);
    void hardDeleteAllById(List<Long> ids);
    PageResult<Variant> findAll(String search, PageQuery pageQuery);
    PageResult<Variant> findByProduct(Long productId, PageQuery pageQuery);
}
