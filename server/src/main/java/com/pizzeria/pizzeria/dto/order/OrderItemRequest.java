package com.pizzeria.pizzeria.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequest {
    @NotNull
    private Long pizzaId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
