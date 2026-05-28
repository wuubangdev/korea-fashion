package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.domain.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductPersistencePort {
    Product save(Product product);
    Optional<Product> findById(Long id);
    void deleteById(Long id);
    void deleteAllById(List<Long> ids);
    void hardDeleteById(Long id);
    void hardDeleteAllById(List<Long> ids);
    PageResult<Product> findAll(String search, PageQuery pageQuery);
    PageResult<Product> findAll(ProductFilter filter, PageQuery pageQuery);
}
