package com.shope.kf.application.service;

import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.application.port.out.ProductPersistencePort;
import com.shope.kf.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
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
    public Page<Product> list(String search, Pageable pageable) {
        return port.findAll(search, pageable);
    }
}
