package com.shope.kf.application.service;

import com.shope.kf.application.port.out.InventoryPersistencePort;
import com.shope.kf.domain.exception.DomainException;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.OrderItem;
import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.api.dto.request.InventoryAdjustmentRequest;
import com.shope.kf.infrastructure.api.dto.response.InventoryAdjustmentResponse;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {
    private final InventoryPersistencePort inventoryPort;

    public InventoryService(InventoryPersistencePort inventoryPort) {
        this.inventoryPort = inventoryPort;
    }

    public InventoryAdjustmentResponse apply(InventoryAdjustmentRequest request) {
        Variant variant = inventoryPort.findVariantById(request.getVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Variant not found"));

        int currentQuantity = variant.quantityOrZero();
        int delta = request.getQuantity();
        if (delta == 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Quantity must not be zero");
        }

        String type = request.getType().trim().toUpperCase();
        try {
            applyToVariant(variant, type, Math.abs(delta));
        } catch (DomainException ex) {
            throw new AppException(ErrorCode.BAD_REQUEST, ex.getMessage());
        }

        inventoryPort.saveVariant(variant);

        Long transactionId = inventoryPort.saveTransaction(new InventoryPersistencePort.InventoryTransactionData(
                request.getProductId() == null ? variant.getProductId() : request.getProductId(),
                variant.getId(),
                type,
                delta,
                currentQuantity,
                variant.quantityOrZero(),
                request.getReferenceType(),
                request.getReferenceId(),
                request.getNote()
        ));

        return new InventoryAdjustmentResponse(
                variant.getId(),
                variant.getQuantity(),
                variant.getReservedQuantity(),
                variant.getAvailableQuantity(),
                transactionId
        );
    }

    public void reserveOrder(Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return;
        }
        String referenceId = order.getOrderCode() == null ? String.valueOf(order.getId()) : order.getOrderCode();
        for (OrderItem item : order.getItems()) {
            if (item.getVariantId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            InventoryAdjustmentRequest request = new InventoryAdjustmentRequest();
            request.setProductId(item.getProductId());
            request.setVariantId(item.getVariantId());
            request.setType("RESERVED");
            request.setQuantity(item.getQuantity());
            request.setReferenceType("ORDER");
            request.setReferenceId(referenceId);
            request.setNote("Reserved for order");
            apply(request);
        }
    }

    public void releaseOrder(Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return;
        }
        String referenceId = order.getOrderCode() == null ? String.valueOf(order.getId()) : order.getOrderCode();
        for (OrderItem item : order.getItems()) {
            if (item.getVariantId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            Variant variant = inventoryPort.findVariantById(item.getVariantId())
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Variant not found"));
            int quantityToRelease = Math.min(item.getQuantity(), variant.reservedQuantityOrZero());
            if (quantityToRelease <= 0) {
                continue;
            }
            InventoryAdjustmentRequest request = new InventoryAdjustmentRequest();
            request.setProductId(item.getProductId());
            request.setVariantId(item.getVariantId());
            request.setType("RELEASED");
            request.setQuantity(quantityToRelease);
            request.setReferenceType("ORDER");
            request.setReferenceId(referenceId);
            request.setNote("Released from cancelled order");
            apply(request);
        }
    }

    public void fulfillOrder(Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return;
        }
        releaseOrder(order);
        String referenceId = order.getOrderCode() == null ? String.valueOf(order.getId()) : order.getOrderCode();
        for (OrderItem item : order.getItems()) {
            if (item.getVariantId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            InventoryAdjustmentRequest request = new InventoryAdjustmentRequest();
            request.setProductId(item.getProductId());
            request.setVariantId(item.getVariantId());
            request.setType("SALE");
            request.setQuantity(item.getQuantity());
            request.setReferenceType("ORDER");
            request.setReferenceId(referenceId);
            request.setNote("Sold by delivered order");
            apply(request);
        }
    }

    private void applyToVariant(Variant variant, String type, int amount) {
        switch (type) {
            case "IMPORT", "RETURN", "ADJUSTMENT_IN" -> variant.increaseStock(amount);
            case "SALE", "DAMAGE", "ADJUSTMENT_OUT" -> variant.decreaseStock(amount);
            case "RESERVED" -> variant.reserve(amount);
            case "RELEASED" -> variant.release(amount);
            default -> throw new AppException(ErrorCode.BAD_REQUEST, "Invalid inventory transaction type");
        }
    }
}
