package com.shope.kf.application.common;

public record PageQuery(int page, int size, String sortBy, SortDirection direction) {
    public PageQuery {
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10;
        }
        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "id";
        }
        if (direction == null) {
            direction = SortDirection.DESC;
        }
    }

    public static PageQuery of(int page, int size, String sort) {
        String[] parts = sort == null ? new String[0] : sort.split(",");
        String sortBy = parts.length > 0 && !parts[0].isBlank() ? parts[0] : "id";
        SortDirection direction = parts.length > 1 ? SortDirection.from(parts[1]) : SortDirection.DESC;
        return new PageQuery(page, size, sortBy, direction);
    }
}
