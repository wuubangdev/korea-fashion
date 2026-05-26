package com.shope.kf.infrastructure.persistence.seed;

import com.shope.kf.infrastructure.persistence.jpa.RoleJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.RoleJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleJpaRepository roleRepo;
    private final UserJpaRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleJpaRepository roleRepo, UserJpaRepository userRepo, PasswordEncoder passwordEncoder) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        RoleJpaEntity userRole = roleRepo.findByName("ROLE_USER").orElseGet(() -> {
            RoleJpaEntity r = new RoleJpaEntity();
            r.setName("ROLE_USER");
            return roleRepo.save(r);
        });

        // create an admin if not exists
        if (userRepo.findByUsername("admin").isEmpty()) {
            UserJpaEntity admin = new UserJpaEntity();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("adminpass"));
            admin.setEmail("admin@example.com");
            admin.setRoles(new HashSet<>());
            admin.getRoles().add(userRole);
            userRepo.save(admin);
        }
    }
}
