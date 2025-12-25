package com.pizzeria.pizzeria.config;

import com.pizzeria.pizzeria.model.*;
import com.pizzeria.pizzeria.repository.OrderRepository;
import com.pizzeria.pizzeria.repository.PizzaRepository;
import com.pizzeria.pizzeria.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PizzaRepository pizzaRepository;
    private final OrderRepository orderRepository;

    @Bean
    @Transactional
    CommandLineRunner initData() {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@pizzeria.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ROLE_ADMIN);

                userRepository.save(admin);
                System.out.println("---------- ADMIN USER CREATED BY DEFAULT ----------");
            }

            User customer = null;
            if (!userRepository.existsByUsername("carlos_pizzas")) {
                customer = new User(null, "carlos_pizzas", "carlos@gmail.com", passwordEncoder.encode("carlos123"), Role.ROLE_USER);
                customer = userRepository.save(customer);
                System.out.println("---------- CUSTOMER USER CREATED ----------");
            } else {
                customer = userRepository.findByUsername("carlos_pizzas").orElse(null);
            }

            List<Pizza> savedPizzas = new ArrayList<>();
            if (pizzaRepository.count() == 0) {
                List<Pizza> defaultPizzas = List.of(
                        new Pizza(null, "Margherita", "Classic tomato sauce and mozzarella", 12.50, "https://res.cloudinary.com/da2yochcc/image/upload/v1766604841/pizzeria_app/i6oqtnbjliaobllbmkax.webp", true),
                        new Pizza(null, "Pepperoni", "Tomato sauce and spicy pepperoni", 15.00, "https://res.cloudinary.com/da2yochcc/image/upload/v1766604837/pizzeria_app/orh59a9faatxz9iy6gpx.jpg", true),
                        new Pizza(null, "Four Cheese", "Mozzarella, parmesan, gorgonzola, and fontina", 16.00, "https://res.cloudinary.com/da2yochcc/image/upload/v1766604837/pizzeria_app/pkc0plh4szranyoyf7f8.jpg", true)
                );
                savedPizzas = pizzaRepository.saveAll(defaultPizzas);
                System.out.println("---------- DEFAULT PIZZAS CREATED ----------");
            } else {
                savedPizzas = pizzaRepository.findAll();
            }

            if (orderRepository.count() == 0 && customer != null && !savedPizzas.isEmpty()) {
                Order order = new Order();
                order.setUser(customer);
                order.setStatus(OrderStatus.PENDING);
                order.setCreatedAt(LocalDateTime.now());

                Pizza p1 = savedPizzas.get(0);
                OrderItem item1 = new OrderItem(null, order, p1, 2, p1.getPrice());

                Pizza p2 = savedPizzas.get(1);
                OrderItem item2 = new OrderItem(null, order, p2, 1, p2.getPrice());

                order.setItems(new ArrayList<>(List.of(item1, item2)));
                order.setTotalAmount((p1.getPrice() * 2) + p2.getPrice());

                orderRepository.save(order);
                System.out.println("---------- TEST ORDER CREATED FOR CARLOS_PIZZAS ----------");
            }
        };
    }
}
