package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.MemberJpaEntity;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/members")
public class MemberController extends CrudController<MemberJpaEntity, String> {
    public MemberController(@Qualifier("memberCrudUseCase") GenericCrudUseCase<MemberJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
