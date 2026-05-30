package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.UserUseCase;
import com.shope.kf.application.port.out.PasswordHasher;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
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
            throw new AppException(ErrorCode.CONFLICT, "Username already exists");
        }
        user.setPassword(passwordHasher.hash(user.getPassword()));
        return port.save(user);
    }

    @Override
    public User copy(Long id) {
        User user = findById(id);
        user.setId(null);
        user.setUsername(CopyValue.unique(user.getUsername()));
        user.setEmail(CopyValue.unique(user.getEmail()));
        return port.save(user);
    }

    @Override
    public User update(Long id, User user) {
        User existing = findById(id);
        existing.setUsername(user.getUsername() == null ? existing.getUsername() : user.getUsername());
        existing.setEmail(user.getEmail() == null ? existing.getEmail() : user.getEmail());
        existing.setFullName(user.getFullName() == null ? existing.getFullName() : user.getFullName());
        existing.setPhone(user.getPhone() == null ? existing.getPhone() : user.getPhone());
        existing.setAddress(user.getAddress() == null ? existing.getAddress() : user.getAddress());
        existing.setCity(user.getCity() == null ? existing.getCity() : user.getCity());
        existing.setDistrict(user.getDistrict() == null ? existing.getDistrict() : user.getDistrict());
        existing.setWard(user.getWard() == null ? existing.getWard() : user.getWard());
        existing.setAvatarUrl(user.getAvatarUrl() == null ? existing.getAvatarUrl() : user.getAvatarUrl());
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
    public void deleteAll(List<Long> ids) {
        port.deleteAllById(ids);
    }

    @Override
    public void restore(Long id) {
        port.restoreById(id);
    }

    @Override
    public void restoreAll(List<Long> ids) {
        port.restoreAllById(ids);
    }

    @Override
    public void hardDelete(Long id) {
        port.hardDeleteById(id);
    }

    @Override
    public void hardDeleteAll(List<Long> ids) {
        port.hardDeleteAllById(ids);
    }

    @Override
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return port.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<User> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<User> trash(String search, PageQuery pageQuery) {
        return port.findDeleted(search, pageQuery);
    }
}
