package com.shope.kf.config;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.adapter.GenericJpaCrudAdapter;
import com.shope.kf.infrastructure.persistence.jpa.*;
import com.shope.kf.infrastructure.persistence.repository.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
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
}
