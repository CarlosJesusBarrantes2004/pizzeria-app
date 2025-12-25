package com.pizzeria.pizzeria.dto.auth;

public record UserResponse(
        Long id,
        String username,
        String email,
        String role
) {
}
