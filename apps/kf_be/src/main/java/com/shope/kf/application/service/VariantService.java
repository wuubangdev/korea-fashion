package com.shope.kf.application.service;

import com.shope.kf.application.port.in.VariantUseCase;
import com.shope.kf.application.port.out.VariantPersistencePort;
import com.shope.kf.domain.model.Variant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VariantService implements VariantUseCase {

    private final VariantPersistencePort port;

    public VariantService(VariantPersistencePort port) {
        this.port = port;
    }

    @Override
    public Variant create(Variant variant) {
        return port.save(variant);
    }

    @Override
    public Variant update(Long id, Variant variant) {
        variant.setId(id);
        return port.save(variant);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public Variant findById(Long id) {
        return port.findById(id).orElseThrow(() -> new RuntimeException("Variant not found"));
    }

    @Override
    public Page<Variant> list(String search, Pageable pageable) {
        return port.findAll(search, pageable);
    }

    @Override
    public Page<Variant> listByProduct(Long productId, Pageable pageable) {
        return port.findByProduct(productId, pageable);
    }
}
