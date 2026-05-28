package com.shope.kf.infrastructure.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);
    private static final long SLOW_CALL_THRESHOLD_MS = 1_000L;

    @Around("within(com.shope.kf.infrastructure.api..*) || within(com.shope.kf.application.service..*)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        try {
            Object result = joinPoint.proceed();
            stopWatch.stop();
            logSuccess(joinPoint, stopWatch.getTotalTimeMillis());
            return result;
        } catch (Throwable ex) {
            stopWatch.stop();
            log.warn("{} failed after {} ms: {}", methodName(joinPoint), stopWatch.getTotalTimeMillis(), ex.getMessage());
            throw ex;
        }
    }

    private void logSuccess(ProceedingJoinPoint joinPoint, long elapsedMs) {
        if (elapsedMs >= SLOW_CALL_THRESHOLD_MS) {
            log.warn("{} completed in {} ms", methodName(joinPoint), elapsedMs);
        } else if (log.isDebugEnabled()) {
            log.debug("{} completed in {} ms", methodName(joinPoint), elapsedMs);
        }
    }

    private String methodName(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        return signature.getDeclaringType().getSimpleName() + "." + signature.getName();
    }
}
