package com.incubyte_kata.api.core.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class BaseException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus status;
    private final LocalDateTime timestamp;

    public BaseException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    public BaseException(String message, Throwable cause, String errorCode, HttpStatus status) {
        super(message, cause);
        this.errorCode = errorCode;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
