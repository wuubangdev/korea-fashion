package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.domain.model.Product;

public interface ProductUseCase {
	Product create(Product product);
	Product update(Long id, Product product);
	void delete(Long id);
	void hardDelete(Long id);
	Product findById(Long id);
	PageResult<Product> list(String search, PageQuery pageQuery);
	PageResult<Product> list(ProductFilter filter, PageQuery pageQuery);
}

