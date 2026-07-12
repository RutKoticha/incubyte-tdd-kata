package com.incubyte_kata.api.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

public record LoginUserRequest (
        @Schema(
                description = "Email provided by the user",
                example = "someone@example.com",
                nullable = false
        )
        @Email(message = "Email should be in a valid format.")
        @NotEmpty
        String email,

        @Schema(
                description = "Password provided by the user",
                example = "P@ssw0rd",
                nullable = false
        )
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = """
                    Password must follow these constraints
                    1. Minimum 8 character length
                    2. At least one lower case character
                    3. At least one upper case character
                    4. At least one digit
                    5. At least one special character"""
        )
        @NotEmpty
        String password
) {}