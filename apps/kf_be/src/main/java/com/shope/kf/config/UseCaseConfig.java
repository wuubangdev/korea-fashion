package com.shope.kf.config;

import com.shope.kf.application.port.out.*;
import com.shope.kf.application.service.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {
    @Bean
    public AuthService authService(UserPersistencePort userPort, PasswordHasher passwordHasher, TokenProvider tokenProvider) {
        return new AuthService(userPort, passwordHasher, tokenProvider);
    }

    @Bean
    public CategoryService categoryService(CategoryPersistencePort port) {
        return new CategoryService(port);
    }

    @Bean
    public OrderService orderService(OrderPersistencePort orderPort, ShipperPersistencePort shipperPort, InventoryService inventoryService) {
        return new OrderService(orderPort, shipperPort, inventoryService);
    }

    @Bean
    public ProductService productService(ProductPersistencePort port) {
        return new ProductService(port);
    }

    @Bean
    public UserService userService(UserPersistencePort port, PasswordHasher passwordHasher) {
        return new UserService(port, passwordHasher);
    }

    @Bean
    public VariantService variantService(VariantPersistencePort port) {
        return new VariantService(port);
    }
}
