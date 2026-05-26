package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Variant;

public interface VariantUseCase {
    Variant create(Variant variant);
    Variant update(Long id, Variant variant);
    void delete(Long id);
    Variant findById(Long id);
    PageResult<Variant> list(String search, PageQuery pageQuery);
    PageResult<Variant> listByProduct(Long productId, PageQuery pageQuery);
}
