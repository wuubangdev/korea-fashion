package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Variant;

import java.util.List;

public interface VariantUseCase {
    Variant create(Variant variant);
    Variant copy(Long id);
    Variant update(Long id, Variant variant);
    void delete(Long id);
    void deleteAll(List<Long> ids);
    void restore(Long id);
    void restoreAll(List<Long> ids);
    void hardDelete(Long id);
    void hardDeleteAll(List<Long> ids);
    Variant findById(Long id);
    PageResult<Variant> list(String search, PageQuery pageQuery);
    PageResult<Variant> trash(String search, PageQuery pageQuery);
    PageResult<Variant> listByProduct(Long productId, PageQuery pageQuery);
}
