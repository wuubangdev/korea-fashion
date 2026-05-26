package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.PurchaseReceiptJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.PurchaseReceiptJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/purchase-receipts")
public class PurchaseReceiptController extends CrudController<PurchaseReceiptJpaEntity, String, PurchaseReceiptJpaRepository> {
    public PurchaseReceiptController(PurchaseReceiptJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
