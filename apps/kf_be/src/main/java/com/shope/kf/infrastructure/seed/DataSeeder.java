package com.shope.kf.infrastructure.seed;

import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.RoleJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.ProductRepository;
import com.shope.kf.infrastructure.persistence.repository.RoleRepository;
import com.shope.kf.infrastructure.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting data seeding...");

        try {
            seedRoles();
            seedUsers();
            seedProducts();
            log.info("Data seeding completed!");
        } catch (Exception e) {
            // If DB is not configured or not available, skip seeding to allow app start for development
            log.warn("Data seeding skipped - database not available or misconfigured. Details: {}", e.getMessage());
            log.debug("Seeding exception stacktrace:", e);
        }
    }

    private void seedRoles() {
        String[] roleNames = {"GUEST", "MEMBER", "ADMIN", "SUPPLIER", "SHIPPER"};
        String[] descriptions = {
            "Guest user with limited access",
            "Regular member of the platform",
            "Administrator with full access",
            "Supplier who sells products",
            "Shipper who delivers products"
        };

        for (int i = 0; i < roleNames.length; i++) {
            if (roleRepository.findByName(roleNames[i]).isEmpty()) {
                RoleJpaEntity role = RoleJpaEntity.builder()
                    .name(roleNames[i])
                    .description(descriptions[i])
                    .build();
                roleRepository.save(role);
                log.info("Role created: {}", roleNames[i]);
            }
        }
    }

    private void seedUsers() {
        RoleJpaEntity guestRole = roleRepository.findByName("GUEST")
            .orElseThrow(() -> new RuntimeException("GUEST role not found"));
        RoleJpaEntity memberRole = roleRepository.findByName("MEMBER")
            .orElseThrow(() -> new RuntimeException("MEMBER role not found"));
        RoleJpaEntity adminRole = roleRepository.findByName("ADMIN")
            .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
        RoleJpaEntity supplierRole = roleRepository.findByName("SUPPLIER")
            .orElseThrow(() -> new RuntimeException("SUPPLIER role not found"));
        RoleJpaEntity shipperRole = roleRepository.findByName("SHIPPER")
            .orElseThrow(() -> new RuntimeException("SHIPPER role not found"));

        // Admin user
        if (userRepository.findByUsername("admin").isEmpty()) {
            UserJpaEntity adminUser = UserJpaEntity.builder()
                .username("admin")
                .email("admin@korashion.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .phone("01234567890")
                .isActive(true)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(Set.of(adminRole))
                .build();
            userRepository.save(adminUser);
            log.info("Admin user created");
        }

        // Supplier user
        if (userRepository.findByUsername("supplier").isEmpty()) {
            UserJpaEntity supplierUser = UserJpaEntity.builder()
                .username("supplier")
                .email("supplier@korashion.com")
                .password(passwordEncoder.encode("supplier123"))
                .firstName("Supplier")
                .lastName("One")
                .phone("01234567891")
                .isActive(true)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(Set.of(supplierRole, memberRole))
                .build();
            userRepository.save(supplierUser);
            log.info("Supplier user created");
        }

        // Shipper user
        if (userRepository.findByUsername("shipper").isEmpty()) {
            UserJpaEntity shipperUser = UserJpaEntity.builder()
                .username("shipper")
                .email("shipper@korashion.com")
                .password(passwordEncoder.encode("shipper123"))
                .firstName("Shipper")
                .lastName("One")
                .phone("01234567892")
                .isActive(true)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(Set.of(shipperRole, memberRole))
                .build();
            userRepository.save(shipperUser);
            log.info("Shipper user created");
        }

        // Member user
        if (userRepository.findByUsername("member").isEmpty()) {
            UserJpaEntity memberUser = UserJpaEntity.builder()
                .username("member")
                .email("member@korashion.com")
                .password(passwordEncoder.encode("member123"))
                .firstName("Member")
                .lastName("One")
                .phone("01234567893")
                .isActive(true)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(Set.of(memberRole))
                .build();
            userRepository.save(memberUser);
            log.info("Member user created");
        }

        // Guest user
        if (userRepository.findByUsername("guest").isEmpty()) {
            UserJpaEntity guestUser = UserJpaEntity.builder()
                .username("guest")
                .email("guest@korashion.com")
                .password(passwordEncoder.encode("guest123"))
                .firstName("Guest")
                .lastName("User")
                .phone("01234567894")
                .isActive(true)
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(Set.of(guestRole))
                .build();
            userRepository.save(guestUser);
            log.info("Guest user created");
        }
    }

    private void seedProducts() {
        UserJpaEntity supplier = userRepository.findByUsername("supplier")
            .orElseThrow(() -> new RuntimeException("Supplier user not found"));

        // Product 1
        if (productRepository.findBySku("KF-SHIRT-001").isEmpty()) {
            ProductJpaEntity product1 = ProductJpaEntity.builder()
                .name("Classic White T-Shirt")
                .description("Premium quality white t-shirt made from 100% cotton")
                .sku("KF-SHIRT-001")
                .price(new BigDecimal("25.99"))
                .costPrice(new BigDecimal("10.00"))
                .stockQuantity(100)
                .minStockLevel(20)
                .imageUrl("https://example.com/products/shirt-001.jpg")
                .isActive(true)
                .isDeleted(false)
                .supplierId(supplier.getId())
                .categoryId(1L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
            productRepository.save(product1);
            log.info("Product created: Classic White T-Shirt");
        }

        // Product 2
        if (productRepository.findBySku("KF-JEAN-001").isEmpty()) {
            ProductJpaEntity product2 = ProductJpaEntity.builder()
                .name("Blue Denim Jeans")
                .description("Comfortable blue denim jeans with classic fit")
                .sku("KF-JEAN-001")
                .price(new BigDecimal("49.99"))
                .costPrice(new BigDecimal("20.00"))
                .stockQuantity(50)
                .minStockLevel(10)
                .imageUrl("https://example.com/products/jean-001.jpg")
                .isActive(true)
                .isDeleted(false)
                .supplierId(supplier.getId())
                .categoryId(2L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
            productRepository.save(product2);
            log.info("Product created: Blue Denim Jeans");
        }

        // Product 3
        if (productRepository.findBySku("KF-DRESS-001").isEmpty()) {
            ProductJpaEntity product3 = ProductJpaEntity.builder()
                .name("Summer Dress")
                .description("Light and breathable summer dress for women")
                .sku("KF-DRESS-001")
                .price(new BigDecimal("39.99"))
                .costPrice(new BigDecimal("15.00"))
                .stockQuantity(75)
                .minStockLevel(15)
                .imageUrl("https://example.com/products/dress-001.jpg")
                .isActive(true)
                .isDeleted(false)
                .supplierId(supplier.getId())
                .categoryId(3L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
            productRepository.save(product3);
            log.info("Product created: Summer Dress");
        }
    }
}

