package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.User;

public interface UserUseCase {
    User create(User user);
    User update(Long id, User user);
    void delete(Long id);
    User findById(Long id);
    PageResult<User> list(String search, PageQuery pageQuery);
}
