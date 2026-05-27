package com.shope.kf.application.service;

import com.shope.kf.infrastructure.api.dto.request.InventoryAdjustmentRequest;
import com.shope.kf.infrastructure.api.dto.response.InventoryAdjustmentResponse;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.jpa.InventoryTransactionJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.VariantJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.InventoryTransactionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.VariantJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {
    private final VariantJpaRepository variantRepo;
    private final InventoryTransactionJpaRepository transactionRepo;

    public InventoryService(VariantJpaRepository variantRepo, InventoryTransactionJpaRepository transactionRepo) {
        this.variantRepo = variantRepo;
        this.transactionRepo = transactionRepo;
    }

    public InventoryAdjustmentResponse apply(InventoryAdjustmentRequest request) {
        VariantJpaEntity variant = variantRepo.findById(request.getVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Variant not found"));

        int currentQuantity = defaultInt(variant.getQuantity());
        int currentReserved = defaultInt(variant.getReservedQuantity());
        int delta = request.getQuantity();
        if (delta == 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Quantity must not be zero");
        }

        int nextQuantity = currentQuantity;
        int nextReserved = currentReserved;
        String type = request.getType().trim().toUpperCase();
        switch (type) {
            case "IMPORT", "RETURN", "ADJUSTMENT_IN" -> nextQuantity = currentQuantity + Math.abs(delta);
            case "SALE", "DAMAGE", "ADJUSTMENT_OUT" -> nextQuantity = currentQuantity - Math.abs(delta);
            case "RESERVED" -> nextReserved = currentReserved + Math.abs(delta);
            case "RELEASED" -> nextReserved = currentReserved - Math.abs(delta);
            default -> throw new AppException(ErrorCode.BAD_REQUEST, "Invalid inventory transaction type");
        }
        if (nextQuantity < 0 || nextReserved < 0 || nextReserved > nextQuantity) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Inventory quantity is not valid");
        }

        variant.setQuantity(nextQuantity);
        variant.setReservedQuantity(nextReserved);
        variant.setAvailableQuantity(nextQuantity - nextReserved);
        variantRepo.save(variant);

        InventoryTransactionJpaEntity tx = new InventoryTransactionJpaEntity();
        tx.setProductId(request.getProductId() == null ? variant.getProductId() : request.getProductId());
        tx.setVariantId(variant.getId());
        tx.setType(type);
        tx.setQuantity(delta);
        tx.setQuantityBefore(currentQuantity);
        tx.setQuantityAfter(nextQuantity);
        tx.setReferenceType(request.getReferenceType());
        tx.setReferenceId(request.getReferenceId());
        tx.setNote(request.getNote());
        InventoryTransactionJpaEntity saved = transactionRepo.save(tx);

        return new InventoryAdjustmentResponse(
                variant.getId(),
                variant.getQuantity(),
                variant.getReservedQuantity(),
                variant.getAvailableQuantity(),
                saved.getId()
        );
    }

    private int defaultInt(Integer value) {
        return value == null ? 0 : value;
    }
}
