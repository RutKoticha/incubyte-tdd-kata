package com.incubyte_kata.api.core.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }

    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND", HttpStatus.CONFLICT);
    }
}
