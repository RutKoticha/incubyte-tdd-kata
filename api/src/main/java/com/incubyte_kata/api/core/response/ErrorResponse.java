package com.incubyte_kata.api.core.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ErrorResponse {

    private String message;
    private String errorCode;
    private int status;
    private LocalDateTime timestamp;
    private List<ValidationError> validationErrors;

    @Getter
    @Builder
    public static class ValidationError {
        private String field;
        private String message;
    }
}
