package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.out.OrderPersistencePort;
import com.shope.kf.domain.model.Order;
import com.shope.kf.infrastructure.persistence.jpa.OrderJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.OrderMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.repository.OrderJpaRepository;
import org.springframework.data.domain.Page;
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
        repo.findById(id).ifPresent(order -> {
            order.markDeleted("system");
            repo.save(order);
        });
    }

    @Override
    public void hardDeleteById(Long id) {
        repo.hardDeleteItemsByOrderId(id);
        repo.hardDeleteById(id);
    }

    @Override
    public PageResult<Order> findAll(String search, PageQuery pageQuery) {
        var pageable = PageMapper.toPageable(pageQuery);
        Page<OrderJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findByStatusContainingIgnoreCase(search, pageable);
        return PageMapper.toResult(page, OrderMapper::toDomain);
    }

    @Override
    public PageResult<Order> findByShipperId(String shipperId, PageQuery pageQuery) {
        return PageMapper.toResult(repo.findByShipperId(shipperId, PageMapper.toPageable(pageQuery)), OrderMapper::toDomain);
    }
}
