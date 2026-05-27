package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.VariantUseCase;
import com.shope.kf.application.port.out.VariantPersistencePort;
import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;

@Transactional
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
    public void hardDelete(Long id) {
        port.hardDeleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Variant findById(Long id) {
        return port.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Variant not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Variant> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Variant> listByProduct(Long productId, PageQuery pageQuery) {
        return port.findByProduct(productId, pageQuery);
    }
}
