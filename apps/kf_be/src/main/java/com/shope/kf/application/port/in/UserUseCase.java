package com.shope.kf.application.port.in;

import com.shope.kf.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserUseCase {
    User create(User user);
    User update(Long id, User user);
    void delete(Long id);
    User findById(Long id);
    Page<User> list(String search, Pageable pageable);
}
