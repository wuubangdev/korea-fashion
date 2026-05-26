package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.GuestCustomerJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.GuestCustomerJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/guest-customers")
public class GuestCustomerController extends CrudController<GuestCustomerJpaEntity, String, GuestCustomerJpaRepository> {
    public GuestCustomerController(GuestCustomerJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
