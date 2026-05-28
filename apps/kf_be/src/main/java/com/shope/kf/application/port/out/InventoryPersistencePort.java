package com.shope.kf.application.port.out;

import com.shope.kf.domain.model.Variant;

import java.util.Optional;

public interface InventoryPersistencePort {
    Optional<Variant> findVariantById(Long id);

    Variant saveVariant(Variant variant);

    Long saveTransaction(InventoryTransactionData transaction);

    record InventoryTransactionData(
            Long productId,
            Long variantId,
            String type,
            Integer quantity,
            Integer quantityBefore,
            Integer quantityAfter,
            String referenceType,
            String referenceId,
            String note
    ) {
    }
}
