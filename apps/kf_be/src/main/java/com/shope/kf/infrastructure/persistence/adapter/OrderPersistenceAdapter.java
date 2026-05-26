package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.port.out.OrderPersistencePort;
import com.shope.kf.domain.model.Order;
import com.shope.kf.infrastructure.persistence.jpa.OrderJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.OrderMapper;
import com.shope.kf.infrastructure.persistence.repository.OrderJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class OrderPersistenceAdapter implements OrderPersistencePort {

    private final OrderJpaRepository repo;

    public OrderPersistenceAdapter(OrderJpaRepository repo) {
        this.repo = repo;
    }

    @Override
    public Order save(Order order) {
        OrderJpaEntity e = OrderMapper.toEntity(order);
        OrderJpaEntity saved = repo.save(e);
        return OrderMapper.toDomain(saved);
    }

    @Override
    public java.util.Optional<Order> findById(Long id) {
        return repo.findById(id).map(OrderMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Page<Order> findAll(String search, Pageable pageable) {
        Page<OrderJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findByStatusContainingIgnoreCase(search, pageable);
        return page.map(OrderMapper::toDomain);
    }

    @Override
    public Page<Order> findByShipperId(String shipperId, Pageable pageable) {
        return repo.findByShipperId(shipperId, pageable).map(OrderMapper::toDomain);
    }
}
