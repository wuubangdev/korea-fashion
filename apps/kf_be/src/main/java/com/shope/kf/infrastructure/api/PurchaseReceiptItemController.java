package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.PurchaseReceiptItemJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.PurchaseReceiptItemJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/purchase-receipt-items")
public class PurchaseReceiptItemController extends CrudController<PurchaseReceiptItemJpaEntity, Long, PurchaseReceiptItemJpaRepository> {
    public PurchaseReceiptItemController(PurchaseReceiptItemJpaRepository repository) {
        super(repository);
    }

    @Override
    protected Long parseId(String id) {
        return Long.valueOf(id);
    }
}
