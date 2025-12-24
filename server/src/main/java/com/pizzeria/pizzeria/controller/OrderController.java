package com.pizzeria.pizzeria.controller;

import com.pizzeria.pizzeria.dto.order.OrderRequest;
import com.pizzeria.pizzeria.model.Order;
import com.pizzeria.pizzeria.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequest orderRequest, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(orderRequest, principal.getName()));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getMyOrders(principal.getName()));
    }
}
