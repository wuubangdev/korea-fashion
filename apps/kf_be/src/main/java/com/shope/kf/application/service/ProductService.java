package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.application.port.out.ProductPersistencePort;
import com.shope.kf.domain.exception.DomainException;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public class ProductService implements ProductUseCase {

    private final ProductPersistencePort port;

    public ProductService(ProductPersistencePort port) {
        this.port = port;
    }

    @Override
    public Product create(Product product) {
        normalize(product);
        return port.save(product);
    }

    @Override
    public Product copy(Long id) {
        Product product = findById(id);
        product.setId(null);
        product.setSku(CopyValue.unique(product.getSku()));
        product.setSlug(CopyValue.unique(product.getSlug()));
        normalize(product);
        return port.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        product.setId(id);
        normalize(product);
        return port.save(product);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public void deleteAll(List<Long> ids) {
        port.deleteAllById(ids);
    }

    @Override
    public void hardDelete(Long id) {
        port.hardDeleteById(id);
    }

    @Override
    public void hardDeleteAll(List<Long> ids) {
        port.hardDeleteAllById(ids);
    }

    @Override
    @Transactional(readOnly = true)
    public Product findById(Long id) {
        return port.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Product not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Product> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Product> list(ProductFilter filter, PageQuery pageQuery) {
        return port.findAll(filter, pageQuery);
    }

    private void normalize(Product product) {
        try {
            product.normalizeForSave();
        } catch (DomainException ex) {
            throw new AppException(ErrorCode.BAD_REQUEST, ex.getMessage());
        }
    }
}
