package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.PurchaseReceiptJpaEntity;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/purchase-receipts")
public class PurchaseReceiptController extends CrudController<PurchaseReceiptJpaEntity, String> {
    public PurchaseReceiptController(@Qualifier("purchaseReceiptCrudUseCase") GenericCrudUseCase<PurchaseReceiptJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
