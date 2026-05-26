package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.SupplierJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.SupplierJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController extends CrudController<SupplierJpaEntity, String, SupplierJpaRepository> {
    public SupplierController(SupplierJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
