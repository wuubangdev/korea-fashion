package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.SizeJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.SizeJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/sizes")
public class SizeController extends CrudController<SizeJpaEntity, String, SizeJpaRepository> {
    public SizeController(SizeJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
