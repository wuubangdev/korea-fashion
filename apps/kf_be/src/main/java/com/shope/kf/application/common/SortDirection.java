package com.shope.kf.application.common;

public enum SortDirection {
    ASC,
    DESC;

    public static SortDirection from(String value) {
        if ("asc".equalsIgnoreCase(value)) {
            return ASC;
        }
        return DESC;
    }
}
