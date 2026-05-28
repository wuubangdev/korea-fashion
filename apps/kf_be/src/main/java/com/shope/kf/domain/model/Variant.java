package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InsufficientStockException;
import com.shope.kf.domain.exception.InvalidDomainStateException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Variant {
    private Long id;
    private Long productId;
    private String sku;
    private String barcode;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer lowStockThreshold;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private String sizeId;
    private String size;
    private String colorId;
    private String color;
    private String colorHex;
    private BigDecimal weight;
    private String imageUrl;
    private Boolean active;

    public void normalizeForSave() {
        if (quantity == null) {
            quantity = 0;
        }
        if (reservedQuantity == null) {
            reservedQuantity = 0;
        }
        validateNonNegative(quantity, "Variant quantity must be zero or positive");
        validateNonNegative(reservedQuantity, "Variant reserved quantity must be zero or positive");
        if (lowStockThreshold != null) {
            validateNonNegative(lowStockThreshold, "Variant low stock threshold must be zero or positive");
        }
        validateNonNegative(price, "Variant price must be zero or positive");
        validateNonNegative(compareAtPrice, "Variant compare-at price must be zero or positive");
        validateNonNegative(costPrice, "Variant cost price must be zero or positive");
        validateNonNegative(weight, "Variant weight must be zero or positive");
        if (reservedQuantity > quantity) {
            throw new InvalidDomainStateException("Variant reserved quantity cannot exceed quantity");
        }
        availableQuantity = quantity - reservedQuantity;
        if (active == null) {
            active = true;
        }
    }

    public int reserve(int amount) {
        requirePositive(amount, "Reserved quantity must be positive");
        if (amount > availableQuantityOrZero()) {
            throw new InsufficientStockException(productId, amount, availableQuantityOrZero());
        }
        int nextReserved = reservedQuantityOrZero() + amount;
        applyQuantities(quantityOrZero(), nextReserved);
        return availableQuantityOrZero();
    }

    public int release(int amount) {
        requirePositive(amount, "Released quantity must be positive");
        int nextReserved = reservedQuantityOrZero() - amount;
        applyQuantities(quantityOrZero(), nextReserved);
        return availableQuantityOrZero();
    }

    public int increaseStock(int amount) {
        requirePositive(amount, "Stock increase must be positive");
        applyQuantities(quantityOrZero() + amount, reservedQuantityOrZero());
        return quantityOrZero();
    }

    public int decreaseStock(int amount) {
        requirePositive(amount, "Stock decrease must be positive");
        if (amount > availableQuantityOrZero()) {
            throw new InsufficientStockException(productId, amount, availableQuantityOrZero());
        }
        applyQuantities(quantityOrZero() - amount, reservedQuantityOrZero());
        return quantityOrZero();
    }

    public boolean isInStock() {
        return availableQuantityOrZero() > 0;
    }

    public boolean isLowStock() {
        return lowStockThreshold != null && availableQuantityOrZero() <= lowStockThreshold;
    }

    public int quantityOrZero() {
        return quantity == null ? 0 : quantity;
    }

    public int reservedQuantityOrZero() {
        return reservedQuantity == null ? 0 : reservedQuantity;
    }

    public int availableQuantityOrZero() {
        return availableQuantity == null ? quantityOrZero() - reservedQuantityOrZero() : availableQuantity;
    }

    private void applyQuantities(int nextQuantity, int nextReserved) {
        if (nextQuantity < 0 || nextReserved < 0 || nextReserved > nextQuantity) {
            throw new InvalidDomainStateException("Inventory quantity is not valid");
        }
        quantity = nextQuantity;
        reservedQuantity = nextReserved;
        availableQuantity = nextQuantity - nextReserved;
    }

    private void requirePositive(int amount, String message) {
        if (amount <= 0) {
            throw new InvalidDomainStateException(message);
        }
    }

    private void validateNonNegative(Integer value, String message) {
        if (value != null && value < 0) {
            throw new InvalidDomainStateException(message);
        }
    }

    private void validateNonNegative(BigDecimal value, String message) {
        if (value != null && value.signum() < 0) {
            throw new InvalidDomainStateException(message);
        }
    }
}
