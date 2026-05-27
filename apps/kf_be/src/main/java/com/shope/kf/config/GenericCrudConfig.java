package com.shope.kf.config;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.adapter.GenericJpaCrudAdapter;
import com.shope.kf.infrastructure.persistence.jpa.*;
import com.shope.kf.infrastructure.persistence.repository.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class GenericCrudConfig {
    @Bean
    public GenericCrudUseCase<AdminJpaEntity, String> adminCrudUseCase(AdminJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<MemberJpaEntity, String> memberCrudUseCase(MemberJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<GuestCustomerJpaEntity, String> guestCustomerCrudUseCase(GuestCustomerJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<CartJpaEntity, String> cartCrudUseCase(CartJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<CartItemJpaEntity, Long> cartItemCrudUseCase(CartItemJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<PromotionJpaEntity, String> promotionCrudUseCase(PromotionJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<SizeJpaEntity, String> sizeCrudUseCase(SizeJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ColorJpaEntity, String> colorCrudUseCase(ColorJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<SupplierJpaEntity, String> supplierCrudUseCase(SupplierJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<PurchaseReceiptJpaEntity, String> purchaseReceiptCrudUseCase(PurchaseReceiptJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<PurchaseReceiptItemJpaEntity, Long> purchaseReceiptItemCrudUseCase(PurchaseReceiptItemJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ReviewJpaEntity, String> reviewCrudUseCase(ReviewJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<PaymentJpaEntity, String> paymentCrudUseCase(PaymentJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ShipperJpaEntity, String> shipperCrudUseCase(ShipperJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<OrderItemJpaEntity, Long> orderItemCrudUseCase(OrderItemJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<BannerJpaEntity, String> bannerCrudUseCase(BannerJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<SiteSettingJpaEntity, String> siteSettingCrudUseCase(SiteSettingJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductImageJpaEntity, Long> productImageCrudUseCase(ProductImageJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<BrandJpaEntity, String> brandCrudUseCase(BrandJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductCollectionJpaEntity, String> productCollectionCrudUseCase(ProductCollectionJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductAttributeJpaEntity, Long> productAttributeCrudUseCase(ProductAttributeJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<InventoryTransactionJpaEntity, Long> inventoryTransactionCrudUseCase(InventoryTransactionJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ShippingMethodJpaEntity, String> shippingMethodCrudUseCase(ShippingMethodJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<PaymentMethodJpaEntity, String> paymentMethodCrudUseCase(PaymentMethodJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<StorePolicyJpaEntity, String> storePolicyCrudUseCase(StorePolicyJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductOptionJpaEntity, Long> productOptionCrudUseCase(ProductOptionJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductOptionValueJpaEntity, Long> productOptionValueCrudUseCase(ProductOptionValueJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }

    @Bean
    public GenericCrudUseCase<ProductTagJpaEntity, String> productTagCrudUseCase(ProductTagJpaRepository repository) {
        return new GenericJpaCrudAdapter<>(repository);
    }
}
