package com.incubyte_kata.api.core.exception;

import org.springframework.http.HttpStatus;

public class BadCredentialsException extends BaseException {

    public BadCredentialsException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.BAD_REQUEST);
    }

    public BadCredentialsException(String message) {
        super(message, "INVALID_CREDENTIALS", HttpStatus.CONFLICT);
    }
}
