package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.domain.model.Product;

import java.util.List;

public interface ProductUseCase {
	Product create(Product product);
	Product copy(Long id);
	Product update(Long id, Product product);
	void delete(Long id);
	void deleteAll(List<Long> ids);
	void restore(Long id);
	void restoreAll(List<Long> ids);
	void hardDelete(Long id);
	void hardDeleteAll(List<Long> ids);
	Product findById(Long id);
	PageResult<Product> list(String search, PageQuery pageQuery);
	PageResult<Product> trash(String search, PageQuery pageQuery);
	PageResult<Product> list(ProductFilter filter, PageQuery pageQuery);
}

