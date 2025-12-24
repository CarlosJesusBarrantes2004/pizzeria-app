package com.pizzeria.pizzeria.service;

import com.pizzeria.pizzeria.dto.order.OrderItemRequest;
import com.pizzeria.pizzeria.dto.order.OrderRequest;
import com.pizzeria.pizzeria.model.Order;
import com.pizzeria.pizzeria.model.OrderItem;
import com.pizzeria.pizzeria.model.Pizza;
import com.pizzeria.pizzeria.model.User;
import com.pizzeria.pizzeria.repository.OrderRepository;
import com.pizzeria.pizzeria.repository.PizzaRepository;
import com.pizzeria.pizzeria.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final PizzaRepository pizzaRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order placeOrder(OrderRequest orderRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);

        double total = 0;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Pizza pizza = pizzaRepository.findById(itemRequest.getPizzaId())
                    .orElseThrow(() -> new RuntimeException("Pizza not found"));

            OrderItem item = new OrderItem();
            item.setPizza(pizza);
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(pizza.getPrice());
            item.setOrder(order);

            order.getItems().add(item);
            total += pizza.getPrice() * itemRequest.getQuantity();
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(String username) {
        return orderRepository.findByUserUsernameOrderByCreatedAtDesc(username);
    }
}
