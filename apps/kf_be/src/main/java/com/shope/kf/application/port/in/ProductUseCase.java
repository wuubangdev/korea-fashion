package com.shope.kf.application.port.in;

import com.shope.kf.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductUseCase {
	Product create(Product product);
	Product update(Long id, Product product);
	void delete(Long id);
	Product findById(Long id);
	Page<Product> list(String search, Pageable pageable);
}

