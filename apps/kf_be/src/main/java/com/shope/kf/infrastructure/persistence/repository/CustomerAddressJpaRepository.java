package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.CustomerAddressJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CustomerAddressJpaRepository extends JpaRepository<CustomerAddressJpaEntity, Long>, JpaSpecificationExecutor<CustomerAddressJpaEntity> {
    List<CustomerAddressJpaEntity> findByCustomerIdOrderByDefaultAddressDescIdDesc(Long customerId);
}
