package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;

import java.util.Optional;

public interface GenericCrudUseCase<T, ID> {
    T create(T body);
    PageResult<T> list(String search, PageQuery pageQuery);
    PageResult<T> listDeleted(String search, PageQuery pageQuery);
    Optional<T> findById(ID id);
    Optional<T> update(ID id, T body);
    boolean delete(ID id);
    boolean restore(ID id);
    int restoreAll(java.util.List<ID> ids);
    boolean hardDelete(ID id);
}
