package com.pizzeria.pizzeria.service;

import com.pizzeria.pizzeria.dto.pizza.PizzaRequest;
import com.pizzeria.pizzeria.model.Pizza;
import com.pizzeria.pizzeria.repository.PizzaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PizzaService {
    private final PizzaRepository pizzaRepository;

    public List<Pizza> getAllAvailable() {
        return pizzaRepository.findByAvailableTrue();
    }

    public Pizza create(PizzaRequest pizzaRequest) {
        Pizza pizza = new Pizza();
        pizza.setName(pizzaRequest.getName());
        pizza.setDescription(pizzaRequest.getDescription());
        pizza.setPrice(pizzaRequest.getPrice());
        pizza.setImageUrl(pizzaRequest.getImageUrl());

        return pizzaRepository.save(pizza);
    }

    public Pizza update(Long id, PizzaRequest pizzaRequest) {
        Pizza pizza = pizzaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pizza not found with id: " + id));

        pizza.setName(pizzaRequest.getName());
        pizza.setDescription(pizzaRequest.getDescription());
        pizza.setPrice(pizzaRequest.getPrice());
        pizza.setImageUrl(pizzaRequest.getImageUrl());

        return pizzaRepository.save(pizza);
    }

    public void delete(Long id) {
        if (!pizzaRepository.existsById(id)) throw new RuntimeException("Cannot delete: Pizza not found");

        pizzaRepository.deleteById(id);
    }
}
