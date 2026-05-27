package com.shope.kf.infrastructure.aop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shope.kf.infrastructure.persistence.jpa.AuditLogJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.AuditLogJpaRepository;
import com.shope.kf.infrastructure.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Aspect
@Component
public class AuditLogAspect {
    private final AuditLogJpaRepository auditLogRepo;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuditLogAspect(AuditLogJpaRepository auditLogRepo, JwtUtil jwtUtil) {
        this.auditLogRepo = auditLogRepo;
        this.jwtUtil = jwtUtil;
    }

    @Around("within(com.shope.kf.infrastructure.api..*)")
    public Object aroundApi(ProceedingJoinPoint pjp) throws Throwable {
        HttpServletRequest request = currentRequest();
        if (request == null || !isWriteMethod(request.getMethod()) || isAuditPath(request.getRequestURI())) {
            return pjp.proceed();
        }
        try {
            Object result = pjp.proceed();
            writeLog(request, pjp.getArgs(), result, "SUCCESS", null);
            return result;
        } catch (Throwable ex) {
            writeLog(request, pjp.getArgs(), null, "FAILED", ex.getMessage());
            throw ex;
        }
    }

    private HttpServletRequest currentRequest() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes servletRequestAttributes) {
            return servletRequestAttributes.getRequest();
        }
        return null;
    }

    private boolean isWriteMethod(String method) {
        return "POST".equalsIgnoreCase(method)
                || "PUT".equalsIgnoreCase(method)
                || "PATCH".equalsIgnoreCase(method)
                || "DELETE".equalsIgnoreCase(method);
    }

    private boolean isAuditPath(String path) {
        return path != null && path.startsWith("/api/audit-logs");
    }

    private void writeLog(HttpServletRequest request, Object[] args, Object result, String status, String message) {
        try {
            AuditLogJpaEntity log = new AuditLogJpaEntity();
            String token = bearerToken(request);
            if (token != null && jwtUtil.validateToken(token)) {
                log.setActorId(jwtUtil.extractUsername(token));
                log.setActorName(jwtUtil.extractUsername(token));
                log.setActorRole(String.join(",", jwtUtil.extractRoles(token)));
            }
            log.setAction(request.getMethod());
            log.setResourceType(resourceType(request.getRequestURI()));
            log.setResourceId(resourceId(request.getRequestURI()));
            log.setRequestMethod(request.getMethod());
            log.setRequestPath(request.getRequestURI());
            log.setIpAddress(resolveIp(request));
            log.setUserAgent(request.getHeader("User-Agent"));
            log.setBeforeData(toJson(args));
            log.setAfterData(toJson(result));
            log.setResult(status);
            log.setMessage(message);
            log.setCreatedTime(LocalDateTime.now());
            auditLogRepo.save(log);
        } catch (Exception ignored) {
        }
    }

    private String bearerToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || header.isBlank()) {
            return null;
        }
        return header.startsWith("Bearer ") ? header.substring(7) : header;
    }

    private String resolveIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String resourceType(String path) {
        if (path == null) {
            return null;
        }
        String[] parts = path.split("/");
        return parts.length > 2 ? parts[2] : path;
    }

    private String resourceId(String path) {
        if (path == null) {
            return null;
        }
        String[] parts = path.split("/");
        return parts.length > 3 ? parts[3] : null;
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            return null;
        }
    }
}
