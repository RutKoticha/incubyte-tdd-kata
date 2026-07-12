package com.incubyte_kata.api.core.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BaseException {

    public DuplicateResourceException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }

    public DuplicateResourceException(String message) {
        super(message, "RESOURCE_CONFLICT", HttpStatus.CONFLICT);
    }
}
