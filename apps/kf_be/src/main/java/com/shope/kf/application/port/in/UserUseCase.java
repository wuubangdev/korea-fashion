package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.User;

import java.util.List;

public interface UserUseCase {
    User create(User user);
    User copy(Long id);
    User update(Long id, User user);
    void delete(Long id);
    void deleteAll(List<Long> ids);
    void restore(Long id);
    void restoreAll(List<Long> ids);
    void hardDelete(Long id);
    void hardDeleteAll(List<Long> ids);
    User findById(Long id);
    PageResult<User> list(String search, PageQuery pageQuery);
    PageResult<User> trash(String search, PageQuery pageQuery);
}
