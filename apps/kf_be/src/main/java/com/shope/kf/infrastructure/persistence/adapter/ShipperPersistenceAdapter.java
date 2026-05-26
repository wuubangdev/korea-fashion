package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.port.out.ShipperPersistencePort;
import com.shope.kf.infrastructure.persistence.repository.ShipperJpaRepository;
import org.springframework.stereotype.Component;

@Component
public class ShipperPersistenceAdapter implements ShipperPersistencePort {
    private final ShipperJpaRepository repository;

    public ShipperPersistenceAdapter(ShipperJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean existsById(String id) {
        return repository.existsById(id);
    }
}
