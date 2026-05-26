package com.shope.kf.application.service;

import com.shope.kf.application.port.in.UserUseCase;
import com.shope.kf.application.port.out.UserPersistencePort;
import com.shope.kf.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserUseCase {
    private final UserPersistencePort port;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserPersistencePort port, PasswordEncoder passwordEncoder) {
        this.port = port;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User create(User user) {
        if (port.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return port.save(user);
    }

    @Override
    public User update(Long id, User user) {
        User existing = findById(id);
        existing.setUsername(user.getUsername() == null ? existing.getUsername() : user.getUsername());
        existing.setEmail(user.getEmail() == null ? existing.getEmail() : user.getEmail());
        existing.setRoles(user.getRoles() == null ? existing.getRoles() : user.getRoles());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
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
    public Page<User> list(String search, Pageable pageable) {
        return port.findAll(search, pageable);
    }
}
