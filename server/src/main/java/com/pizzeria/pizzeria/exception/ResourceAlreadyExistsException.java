package com.pizzeria.pizzeria.exception;

public class ResourceAlreadyExistsException extends RuntimeException {
    public static final long serialVersionUID = 1L;

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}
