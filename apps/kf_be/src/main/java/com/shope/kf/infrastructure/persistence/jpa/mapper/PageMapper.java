package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.SortDirection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.function.Function;

public final class PageMapper {
    private PageMapper() {
    }

    public static Pageable toPageable(PageQuery query) {
        Sort.Direction direction = query.direction() == SortDirection.ASC ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(query.page(), query.size(), Sort.by(direction, query.sortBy()));
    }

    public static <T, R> PageResult<R> toResult(Page<T> page, Function<T, R> mapper) {
        return new PageResult<>(
                page.getContent().stream().map(mapper).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
