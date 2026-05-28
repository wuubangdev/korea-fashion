package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface UserPersistencePort {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    void deleteById(Long id);
    void deleteAllById(List<Long> ids);
    void hardDeleteById(Long id);
    void hardDeleteAllById(List<Long> ids);
    PageResult<User> findAll(String search, PageQuery pageQuery);
}
