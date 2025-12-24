package com.pizzeria.pizzeria.controller;

import com.pizzeria.pizzeria.dto.pizza.PizzaRequest;
import com.pizzeria.pizzeria.model.Pizza;
import com.pizzeria.pizzeria.service.PizzaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pizzas")
@RequiredArgsConstructor
public class PizzaController {
    private final PizzaService pizzaService;

    @GetMapping
    public ResponseEntity<List<Pizza>> getMenu() {
        return ResponseEntity.ok(pizzaService.getAllAvailable());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pizza> create(@Valid @RequestBody PizzaRequest pizzaRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pizzaService.create(pizzaRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pizza> update(@PathVariable Long id, @Valid @RequestBody PizzaRequest pizzaRequest) {
        return ResponseEntity.ok(pizzaService.update(id, pizzaRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pizzaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
