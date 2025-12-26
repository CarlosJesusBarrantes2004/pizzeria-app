package com.pizzeria.pizzeria.dto.order;

public record OrderItemResponse(
        String pizzaName, String pizzaImage, Double unitPrice, Integer quantity
) {
}
