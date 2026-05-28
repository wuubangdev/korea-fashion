package com.shope.kf.domain.exception;

public class RoleNotFoundException extends DomainException {
    private final String roleName;

    public RoleNotFoundException(String roleName) {
        super("ROLE_NOT_FOUND", "Role not found: " + roleName);
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }
}
