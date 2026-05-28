package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.port.out.InventoryPersistencePort;
import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.persistence.jpa.InventoryTransactionJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.VariantMapper;
import com.shope.kf.infrastructure.persistence.repository.InventoryTransactionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.VariantJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class InventoryPersistenceAdapter implements InventoryPersistencePort {
    private final VariantJpaRepository variantRepo;
    private final InventoryTransactionJpaRepository transactionRepo;

    public InventoryPersistenceAdapter(VariantJpaRepository variantRepo, InventoryTransactionJpaRepository transactionRepo) {
        this.variantRepo = variantRepo;
        this.transactionRepo = transactionRepo;
    }

    @Override
    public Optional<Variant> findVariantById(Long id) {
        return variantRepo.findById(id).map(VariantMapper::toDomain);
    }

    @Override
    public Variant saveVariant(Variant variant) {
        return VariantMapper.toDomain(variantRepo.save(VariantMapper.toEntity(variant)));
    }

    @Override
    public Long saveTransaction(InventoryTransactionData transaction) {
        InventoryTransactionJpaEntity entity = new InventoryTransactionJpaEntity();
        entity.setProductId(transaction.productId());
        entity.setVariantId(transaction.variantId());
        entity.setType(transaction.type());
        entity.setQuantity(transaction.quantity());
        entity.setQuantityBefore(transaction.quantityBefore());
        entity.setQuantityAfter(transaction.quantityAfter());
        entity.setReferenceType(transaction.referenceType());
        entity.setReferenceId(transaction.referenceId());
        entity.setNote(transaction.note());
        return transactionRepo.save(entity).getId();
    }
}
