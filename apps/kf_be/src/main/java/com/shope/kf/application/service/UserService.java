package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.UserUseCase;
import com.shope.kf.application.port.out.PasswordHasher;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.domain.model.User;

public class UserService implements UserUseCase {
    private final UserPersistencePort port;
    private final PasswordHasher passwordHasher;

    public UserService(UserPersistencePort port, PasswordHasher passwordHasher) {
        this.port = port;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public User create(User user) {
        if (port.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordHasher.hash(user.getPassword()));
        return port.save(user);
    }

    @Override
    public User update(Long id, User user) {
        User existing = findById(id);
        existing.setUsername(user.getUsername() == null ? existing.getUsername() : user.getUsername());
        existing.setEmail(user.getEmail() == null ? existing.getEmail() : user.getEmail());
        existing.setRoles(user.getRoles() == null ? existing.getRoles() : user.getRoles());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existing.setPassword(passwordHasher.hash(user.getPassword()));
        }
        return port.save(existing);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public User findById(Long id) {
        return port.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public PageResult<User> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }
}
