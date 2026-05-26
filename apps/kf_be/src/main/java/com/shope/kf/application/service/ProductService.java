package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.application.port.out.ProductPersistencePort;
import com.shope.kf.domain.model.Product;

public class ProductService implements ProductUseCase {

    private final ProductPersistencePort port;

    public ProductService(ProductPersistencePort port) {
        this.port = port;
    }

    @Override
    public Product create(Product product) {
        return port.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        product.setId(id);
        return port.save(product);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public Product findById(Long id) {
        return port.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public PageResult<Product> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }
}
