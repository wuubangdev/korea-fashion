package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.AdminJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.AdminJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/admins")
public class AdminController extends CrudController<AdminJpaEntity, String, AdminJpaRepository> {
    public AdminController(AdminJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
