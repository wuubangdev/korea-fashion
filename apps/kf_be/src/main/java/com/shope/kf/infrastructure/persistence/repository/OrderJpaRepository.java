package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.OrderJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderJpaRepository extends JpaRepository<OrderJpaEntity, Long> {
    Page<OrderJpaEntity> findByStatusContainingIgnoreCase(String status, Pageable pageable);
    Page<OrderJpaEntity> findByCustomerId(Long customerId, Pageable pageable);
    Page<OrderJpaEntity> findByShipperId(String shipperId, Pageable pageable);

    @Modifying
    @Query(value = "delete from orders where id = :id", nativeQuery = true)
    int hardDeleteById(@Param("id") Long id);

    @Modifying
    @Query(value = "delete from orders where id in (:ids)", nativeQuery = true)
    int hardDeleteByIdIn(@Param("ids") List<Long> ids);

    @Modifying
    @Query(value = "delete from order_items where order_id = :id", nativeQuery = true)
    int hardDeleteItemsByOrderId(@Param("id") Long id);

    @Modifying
    @Query(value = "delete from order_items where order_id in (:ids)", nativeQuery = true)
    int hardDeleteItemsByOrderIdIn(@Param("ids") List<Long> ids);

    @Query("select coalesce(sum(o.grandTotal), 0) from OrderJpaEntity o where upper(o.status) in (upper(:statusA), upper(:statusB))")
    BigDecimal sumGrandTotalByStatuses(@Param("statusA") String statusA, @Param("statusB") String statusB);
}
