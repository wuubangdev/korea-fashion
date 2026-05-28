package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InsufficientStockException;
import com.shope.kf.domain.exception.InvalidDomainStateException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class VariantTest {

    @Test
    void reserve_updatesReservedAndAvailableQuantity() {
        Variant variant = Variant.builder()
                .quantity(10)
                .reservedQuantity(2)
                .availableQuantity(8)
                .build();

        variant.reserve(3);

        assertEquals(10, variant.getQuantity());
        assertEquals(5, variant.getReservedQuantity());
        assertEquals(5, variant.getAvailableQuantity());
    }

    @Test
    void decreaseStock_belowReservedQuantity_isRejected() {
        Variant variant = Variant.builder()
                .quantity(10)
                .reservedQuantity(4)
                .availableQuantity(6)
                .build();

        assertThrows(InsufficientStockException.class, () -> variant.decreaseStock(7));
    }

    @Test
    void lowStock_usesAvailableQuantity() {
        Variant variant = Variant.builder()
                .quantity(10)
                .reservedQuantity(8)
                .availableQuantity(2)
                .lowStockThreshold(3)
                .build();

        assertTrue(variant.isInStock());
        assertTrue(variant.isLowStock());

        variant.reserve(2);

        assertFalse(variant.isInStock());
        assertTrue(variant.isLowStock());
    }

    @Test
    void normalizeForSave_recalculatesAvailableQuantityAndDefaultsActive() {
        Variant variant = Variant.builder()
                .quantity(10)
                .reservedQuantity(3)
                .availableQuantity(99)
                .build();

        variant.normalizeForSave();

        assertEquals(7, variant.getAvailableQuantity());
        assertTrue(variant.getActive());
    }

    @Test
    void normalizeForSave_rejectsReservedQuantityGreaterThanQuantity() {
        Variant variant = Variant.builder()
                .quantity(2)
                .reservedQuantity(3)
                .build();

        assertThrows(InvalidDomainStateException.class, variant::normalizeForSave);
    }
}
