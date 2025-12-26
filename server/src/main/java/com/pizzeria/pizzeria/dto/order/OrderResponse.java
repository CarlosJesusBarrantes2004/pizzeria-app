package com.pizzeria.pizzeria.dto.order;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id, Double totalAmount, String status, LocalDateTime createdAt, List<OrderItemResponse> items) {
}
