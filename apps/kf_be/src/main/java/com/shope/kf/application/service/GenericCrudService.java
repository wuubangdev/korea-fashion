package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

@Transactional
public class GenericCrudService<T, ID> implements GenericCrudUseCase<T, ID> {
    private final GenericCrudUseCase<T, ID> delegate;
    private final GenericCrudValidator<T> validator;

    public GenericCrudService(GenericCrudUseCase<T, ID> delegate) {
        this(delegate, GenericCrudValidator.noop());
    }

    public GenericCrudService(GenericCrudUseCase<T, ID> delegate, GenericCrudValidator<T> validator) {
        this.delegate = delegate;
        this.validator = validator;
    }

    @Override
    public T create(T body) {
        validator.validateForCreate(body);
        return delegate.create(body);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<T> list(String search, PageQuery pageQuery) {
        return delegate.list(search, pageQuery);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<T> listDeleted(String search, PageQuery pageQuery) {
        return delegate.listDeleted(search, pageQuery);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<T> findById(ID id) {
        return delegate.findById(id);
    }

    @Override
    public Optional<T> update(ID id, T body) {
        validator.validateForUpdate(body);
        return delegate.update(id, body);
    }

    @Override
    public boolean delete(ID id) {
        return delegate.delete(id);
    }

    @Override
    public boolean restore(ID id) {
        return delegate.restore(id);
    }

    @Override
    public int restoreAll(List<ID> ids) {
        return delegate.restoreAll(ids);
    }

    @Override
    public boolean hardDelete(ID id) {
        return delegate.hardDelete(id);
    }
}
