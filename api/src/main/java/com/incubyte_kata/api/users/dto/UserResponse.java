package com.incubyte_kata.api.users.dto;

import com.incubyte_kata.api.users.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

public record UserResponse (
        @Schema(description = "Id of the user", example = "1")
        Long id,

        @Schema(description = "Name of the user", example = "John Doe")
        String name,

        @Schema(description = "Email of the user", example = "someone@example.com")
        String email,

        @Schema(description = "Role of the user", example = "USER")
        UserRole role
) {}