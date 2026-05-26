package com.shope.kf.infrastructure.aop;

import com.shope.kf.infrastructure.exception.UnauthorizedException;
import com.shope.kf.infrastructure.security.JwtUtil;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuthAspect {

    private final JwtUtil jwtUtil;

    public AuthAspect(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Around("@within(requireAuth) || @annotation(requireAuth)")
    public Object around(ProceedingJoinPoint pjp, RequireAuth requireAuth) throws Throwable {
        RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
        if (!(attrs instanceof ServletRequestAttributes)) {
            throw new UnauthorizedException("No request context");
        }
        HttpServletRequest req = ((ServletRequestAttributes) attrs).getRequest();
        String header = req.getHeader("Authorization");
        if (header == null || header.isBlank()) {
            throw new UnauthorizedException("Missing Authorization header");
        }
        String token = header.startsWith("Bearer ") ? header.substring(7) : header;
        if (!jwtUtil.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired token");
        }
        // Optionally: extract username or roles
        return pjp.proceed();
    }
}
