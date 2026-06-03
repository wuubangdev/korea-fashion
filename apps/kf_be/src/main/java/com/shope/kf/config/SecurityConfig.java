package com.shope.kf.config;

import com.shope.kf.infrastructure.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final String allowedOrigins;
    private static final String[] PUBLIC_READ_ENDPOINTS = {
            "/api/storefront/**",
            "/api/products",
            "/api/products/{id}",
            "/api/products/{id}/reviews",
            "/api/categories",
            "/api/categories/{id}",
            "/api/variants",
            "/api/variants/{id}",
            "/api/variants/product/{productId}",
            "/api/colors",
            "/api/colors/{id}",
            "/api/sizes",
            "/api/sizes/{id}",
            "/api/promotions",
            "/api/promotions/{id}",
            "/api/reviews",
            "/api/reviews/{id}",
            "/api/banners",
            "/api/banners/{id}",
            "/api/site-settings/current",
            "/api/brands",
            "/api/brands/{id}",
            "/api/product-collections",
            "/api/product-collections/{id}",
            "/api/product-attributes",
            "/api/product-attributes/{id}",
            "/api/product-options",
            "/api/product-options/{id}",
            "/api/product-option-values",
            "/api/product-option-values/{id}",
            "/api/product-tags",
            "/api/product-tags/{id}",
            "/api/product-relations",
            "/api/product-relations/{id}",
            "/api/shipping-methods",
            "/api/shipping-methods/{id}",
            "/api/payment-methods",
            "/api/payment-methods/{id}",
            "/api/store-policies",
            "/api/store-policies/{id}",
            "/api/pages",
            "/api/pages/{id}",
            "/api/menus",
            "/api/menus/{id}",
            "/api/menu-items",
            "/api/menu-items/{id}",
            "/api/blog-posts",
            "/api/blog-posts/{id}",
            "/api/faqs",
            "/api/faqs/{id}",
            "/api/health/**",
            "/uploads/**"
    };

    public SecurityConfig(@Value("${app.cors.allowed-origins:*}") String allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/chatbot/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/contact-messages", "/api/orders", "/api/storefront/coupons/validate").permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_READ_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.HEAD, PUBLIC_READ_ENDPOINTS).permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList());
        configuration.setAllowedMethods(Arrays.asList("GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Range"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept-Ranges", "Content-Length", "Content-Range"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
