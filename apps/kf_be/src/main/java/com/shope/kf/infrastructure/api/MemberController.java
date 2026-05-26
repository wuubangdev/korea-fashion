package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.MemberJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.MemberJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/members")
public class MemberController extends CrudController<MemberJpaEntity, String, MemberJpaRepository> {
    public MemberController(MemberJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
