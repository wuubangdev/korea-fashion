package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.AuditLogJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth(roles = {RoleConstants.ADMIN})
@RequestMapping("/api/audit-logs")
public class AuditLogController extends CrudController<AuditLogJpaEntity, Long> {
    public AuditLogController(GenericCrudUseCase<AuditLogJpaEntity, Long> useCase) {
        super(useCase);
    }

    @Override
    protected Long parseId(String id) {
        return Long.parseLong(id);
    }
}
