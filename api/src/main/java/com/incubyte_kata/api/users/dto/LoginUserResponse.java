package com.incubyte_kata.api.users.dto;

public record LoginUserResponse(
        String token,
        UserResponse userData
) {}
