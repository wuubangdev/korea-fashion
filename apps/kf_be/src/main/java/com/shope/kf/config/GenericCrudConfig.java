package com.shope.kf.config;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.application.service.GenericCrudService;
import com.shope.kf.application.service.GenericStatusValidator;
import com.shope.kf.infrastructure.persistence.adapter.GenericJpaCrudAdapter;
import com.shope.kf.infrastructure.persistence.jpa.*;
import com.shope.kf.infrastructure.persistence.repository.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class GenericCrudConfig {
    private <T, ID, R extends JpaRepository<T, ID> & JpaSpecificationExecutor<T>> GenericCrudUseCase<T, ID> genericCrudUseCase(R repository) {
        return new GenericCrudService<>(new GenericJpaCrudAdapter<>(repository), new GenericStatusValidator<>());
    }

    @Bean
    public GenericCrudUseCase<AdminJpaEntity, String> adminCrudUseCase(AdminJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<MemberJpaEntity, String> memberCrudUseCase(MemberJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<GuestCustomerJpaEntity, String> guestCustomerCrudUseCase(GuestCustomerJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<CartJpaEntity, String> cartCrudUseCase(CartJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<CartItemJpaEntity, Long> cartItemCrudUseCase(CartItemJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<PromotionJpaEntity, String> promotionCrudUseCase(PromotionJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<SizeJpaEntity, String> sizeCrudUseCase(SizeJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ColorJpaEntity, String> colorCrudUseCase(ColorJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<SupplierJpaEntity, String> supplierCrudUseCase(SupplierJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<PurchaseReceiptJpaEntity, String> purchaseReceiptCrudUseCase(PurchaseReceiptJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<PurchaseReceiptItemJpaEntity, Long> purchaseReceiptItemCrudUseCase(PurchaseReceiptItemJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ReviewJpaEntity, String> reviewCrudUseCase(ReviewJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<PaymentJpaEntity, String> paymentCrudUseCase(PaymentJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ShipperJpaEntity, String> shipperCrudUseCase(ShipperJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<OrderItemJpaEntity, Long> orderItemCrudUseCase(OrderItemJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<BannerJpaEntity, String> bannerCrudUseCase(BannerJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<SiteSettingJpaEntity, String> siteSettingCrudUseCase(SiteSettingJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductImageJpaEntity, Long> productImageCrudUseCase(ProductImageJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<BrandJpaEntity, String> brandCrudUseCase(BrandJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductCollectionJpaEntity, String> productCollectionCrudUseCase(ProductCollectionJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductAttributeJpaEntity, Long> productAttributeCrudUseCase(ProductAttributeJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<InventoryTransactionJpaEntity, Long> inventoryTransactionCrudUseCase(InventoryTransactionJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ShippingMethodJpaEntity, String> shippingMethodCrudUseCase(ShippingMethodJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<PaymentMethodJpaEntity, String> paymentMethodCrudUseCase(PaymentMethodJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<StorePolicyJpaEntity, String> storePolicyCrudUseCase(StorePolicyJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductOptionJpaEntity, Long> productOptionCrudUseCase(ProductOptionJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductOptionValueJpaEntity, Long> productOptionValueCrudUseCase(ProductOptionValueJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductTagJpaEntity, String> productTagCrudUseCase(ProductTagJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<CouponJpaEntity, String> couponCrudUseCase(CouponJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<CouponRedemptionJpaEntity, String> couponRedemptionCrudUseCase(CouponRedemptionJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ReturnRequestJpaEntity, String> returnRequestCrudUseCase(ReturnRequestJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ReturnItemJpaEntity, Long> returnItemCrudUseCase(ReturnItemJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<RefundJpaEntity, String> refundCrudUseCase(RefundJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ExchangeOrderJpaEntity, String> exchangeOrderCrudUseCase(ExchangeOrderJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<CustomerAddressJpaEntity, Long> customerAddressCrudUseCase(CustomerAddressJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ReviewImageJpaEntity, Long> reviewImageCrudUseCase(ReviewImageJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductRelationJpaEntity, Long> productRelationCrudUseCase(ProductRelationJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<PageJpaEntity, String> pageCrudUseCase(PageJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<MenuJpaEntity, String> menuCrudUseCase(MenuJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<MenuItemJpaEntity, Long> menuItemCrudUseCase(MenuItemJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<BlogPostJpaEntity, String> blogPostCrudUseCase(BlogPostJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<FaqJpaEntity, Long> faqCrudUseCase(FaqJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<PaymentTransactionJpaEntity, String> paymentTransactionCrudUseCase(PaymentTransactionJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ShipmentJpaEntity, String> shipmentCrudUseCase(ShipmentJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<ShipmentEventJpaEntity, Long> shipmentEventCrudUseCase(ShipmentEventJpaRepository repository) {
        return genericCrudUseCase(repository);
    }

    @Bean
    public GenericCrudUseCase<AuditLogJpaEntity, Long> auditLogCrudUseCase(AuditLogJpaRepository repository) {
        return genericCrudUseCase(repository);
    }
}

