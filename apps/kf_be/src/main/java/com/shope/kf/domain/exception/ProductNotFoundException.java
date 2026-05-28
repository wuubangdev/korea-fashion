package com.shope.kf.domain.exception;

public class ProductNotFoundException extends DomainException {
    private final Long productId;

    public ProductNotFoundException(Long productId) {
        super("PRODUCT_NOT_FOUND", "Product not found: " + productId);
        this.productId = productId;
    }

    public Long getProductId() {
        return productId;
    }
}
