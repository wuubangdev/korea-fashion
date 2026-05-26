package com.shope.kf.application.port.out;

import java.util.Set;

public interface TokenProvider {
    String generateToken(String username, Set<String> roles);
}
