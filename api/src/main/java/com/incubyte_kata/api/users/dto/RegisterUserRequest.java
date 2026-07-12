package com.incubyte_kata.api.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record RegisterUserRequest (
        @Schema(
                description = "Name of the user",
                example = "John Doe",
                nullable = false
        )
        @NotEmpty
        @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters long.")
        String name,

        @Schema(
                description = "Email of the user",
                example = "someone@example.com",
                nullable = false
        )
        @Email(message = "Email should be in a valid format.")
        @NotEmpty
        String email,

        @Schema(
                description = "Password of the user",
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
        String password,

        @Schema(
                description = "Confirm Password of the user",
                example = "P@ssw0rd",
                nullable = false
        )
        @NotEmpty
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = """
                    Confirm Password must follow these constraints
                    1. Minimum 8 character length
                    2. At least one lower case character
                    3. At least one upper case character
                    4. At least one digit
                    5. At least one special character"""
        )
        String confirmPassword
) {}
