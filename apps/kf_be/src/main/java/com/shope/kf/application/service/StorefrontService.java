package com.shope.kf.application.service;

import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.StorefrontUseCase;
import com.shope.kf.application.port.out.StorefrontQueryPort;
import com.shope.kf.application.result.CouponValidationCommand;
import com.shope.kf.application.result.CouponValidationResult;
import com.shope.kf.infrastructure.api.dto.response.StorefrontFiltersResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontHomeResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductDetailResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductSummaryResponse;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Transactional(readOnly = true)
public class StorefrontService implements StorefrontUseCase {
    private final StorefrontQueryPort queryPort;

    public StorefrontService(StorefrontQueryPort queryPort) {
        this.queryPort = queryPort;
    }

    @Override
    public StorefrontHomeResponse home() {
        return queryPort.home();
    }

    @Override
    public PageResult<StorefrontProductSummaryResponse> products(String search, Long categoryId, String brand, String brandId,
            String collectionId, String gender, String style, String season, BigDecimal priceMin, BigDecimal priceMax,
            Boolean inStock, Boolean featured, Boolean newArrival, Boolean bestSeller, Boolean sale, int page, int size, String sort) {
        return queryPort.products(search, categoryId, brand, brandId, collectionId, gender, style, season,
                priceMin, priceMax, inStock, featured, newArrival, bestSeller, sale, page, size, sort);
    }

    @Override
    public StorefrontProductDetailResponse productDetail(String slugOrId) {
        return queryPort.productDetail(slugOrId);
    }

    @Override
    public Object categories() {
        return queryPort.categories();
    }

    @Override
    public Object banners() {
        return queryPort.banners();
    }

    @Override
    public Object siteSettings() {
        return queryPort.siteSettings();
    }

    @Override
    public Object shippingMethods() {
        return queryPort.shippingMethods();
    }

    @Override
    public Object paymentMethods() {
        return queryPort.paymentMethods();
    }

    @Override
    public Object policies() {
        return queryPort.policies();
    }

    @Override
    public Object policy(String slug) {
        return queryPort.policy(slug);
    }

    @Override
    public Object pages() {
        return queryPort.pages();
    }

    @Override
    public Object page(String slug) {
        return queryPort.page(slug);
    }

    @Override
    public Object menu(String code) {
        return queryPort.menu(code);
    }

    @Override
    public Object blogPosts() {
        return queryPort.blogPosts();
    }

    @Override
    public Object blogPost(String slug) {
        return queryPort.blogPost(slug);
    }

    @Override
    public Object faqs() {
        return queryPort.faqs();
    }

    @Override
    public CouponValidationResult validateCoupon(CouponValidationCommand command) {
        return queryPort.validateCoupon(command);
    }

    @Override
    public StorefrontFiltersResponse filters() {
        return queryPort.filters();
    }

    @Override
    public Object searchSuggestions(String search, int size) {
        return queryPort.searchSuggestions(search, size);
    }

    @Override
    public Object relatedProducts(String slugOrId, int size) {
        return queryPort.relatedProducts(slugOrId, size);
    }
}
