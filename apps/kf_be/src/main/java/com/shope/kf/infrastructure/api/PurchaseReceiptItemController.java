package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.PurchaseReceiptItemJpaEntity;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/purchase-receipt-items")
public class PurchaseReceiptItemController extends CrudController<PurchaseReceiptItemJpaEntity, Long> {
    public PurchaseReceiptItemController(@Qualifier("purchaseReceiptItemCrudUseCase") GenericCrudUseCase<PurchaseReceiptItemJpaEntity, Long> useCase) {
        super(useCase);
    }

    @Override
    protected Long parseId(String id) {
        return Long.valueOf(id);
    }
}
