package com.shope.kf.infrastructure.aop;

import com.shope.kf.infrastructure.exception.ForbiddenException;
import com.shope.kf.infrastructure.exception.UnauthorizedException;
import com.shope.kf.infrastructure.security.JwtUtil;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Set;

@Aspect
@Component
public class AuthAspect {

    private final JwtUtil jwtUtil;

    public AuthAspect(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Around("@within(com.shope.kf.infrastructure.security.RequireAuth) || @annotation(com.shope.kf.infrastructure.security.RequireAuth)")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        RequireAuth requireAuth = resolveRequireAuth(pjp);
        RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
        if (!(attrs instanceof ServletRequestAttributes)) {
            throw new UnauthorizedException("No request context");
        }
        HttpServletRequest req = ((ServletRequestAttributes) attrs).getRequest();
        if (isPublicReadMethod(req.getMethod()) && isPublicReadPath(req.getRequestURI())) {
            return pjp.proceed();
        }
        String header = req.getHeader("Authorization");
        if (header == null || header.isBlank()) {
            throw new UnauthorizedException("Missing Authorization header");
        }
        String token = header.startsWith("Bearer ") ? header.substring(7) : header;
        if (!jwtUtil.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired token");
        }
        if (requireAuth != null && requireAuth.roles().length > 0) {
            assertHasRole(token, requireAuth.roles());
        }
        return pjp.proceed();
    }

    private RequireAuth resolveRequireAuth(ProceedingJoinPoint pjp) {
        Method method = ((MethodSignature) pjp.getSignature()).getMethod();
        RequireAuth methodAnnotation = AnnotatedElementUtils.findMergedAnnotation(method, RequireAuth.class);
        if (methodAnnotation != null) {
            return methodAnnotation;
        }
        return AnnotatedElementUtils.findMergedAnnotation(pjp.getTarget().getClass(), RequireAuth.class);
    }

    private void assertHasRole(String token, String[] requiredRoles) {
        Set<String> userRoles = jwtUtil.extractRoles(token);
        boolean allowed = Arrays.stream(requiredRoles)
                .anyMatch(requiredRole -> userRoles.stream().anyMatch(userRole -> sameRole(userRole, requiredRole)));
        if (!allowed) {
            throw new ForbiddenException("Insufficient role");
        }
    }

    private boolean sameRole(String userRole, String requiredRole) {
        if (userRole == null || requiredRole == null) {
            return false;
        }
        String normalizedUserRole = normalizeRole(userRole);
        String normalizedRequiredRole = normalizeRole(requiredRole);
        return normalizedUserRole.equals(normalizedRequiredRole);
    }

    private boolean isPublicReadMethod(String method) {
        return "GET".equalsIgnoreCase(method)
                || "HEAD".equalsIgnoreCase(method)
                || "OPTIONS".equalsIgnoreCase(method);
    }

    private boolean isPublicReadPath(String path) {
        return path != null && (
                path.startsWith("/api/storefront")
                        || path.startsWith("/api/products")
                        || path.startsWith("/api/categories")
                        || path.startsWith("/api/variants")
                        || path.startsWith("/api/colors")
                        || path.startsWith("/api/sizes")
                        || path.startsWith("/api/promotions")
                        || path.startsWith("/api/banners")
                        || path.startsWith("/api/site-settings")
                        || path.startsWith("/api/product-images")
                        || path.startsWith("/api/brands")
                        || path.startsWith("/api/product-collections")
                        || path.startsWith("/api/product-attributes")
                        || path.startsWith("/api/product-options")
                        || path.startsWith("/api/product-option-values")
                        || path.startsWith("/api/product-tags")
                        || path.startsWith("/api/shipping-methods")
                        || path.startsWith("/api/payment-methods")
                        || path.startsWith("/api/store-policies")
                        || path.startsWith("/api/health")
        );
    }

    private String normalizeRole(String role) {
        String trimmed = role.trim().toUpperCase(java.util.Locale.ROOT);
        if (trimmed.startsWith("ROLE_")) {
            return trimmed.substring("ROLE_".length());
        }
        return trimmed;
    }
}
