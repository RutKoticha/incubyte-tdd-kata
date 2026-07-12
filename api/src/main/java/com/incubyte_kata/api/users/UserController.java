package com.incubyte_kata.api.users;

import com.incubyte_kata.api.core.response.ApiResponse;
import com.incubyte_kata.api.users.dto.LoginUserRequest;
import com.incubyte_kata.api.users.dto.LoginUserResponse;
import com.incubyte_kata.api.users.dto.RegisterUserRequest;
import com.incubyte_kata.api.users.dto.UserResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(
            @Valid
            @RequestBody
            RegisterUserRequest request) {
        UserResponse response = userService.registerUser(request);

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .status("success")
                        .message("User registered successfully")
                        .data(response)
                        .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginUserResponse>> loginUser(
            @Valid
            @RequestBody
            LoginUserRequest request) {
        LoginUserResponse response = userService.loginUser(request);

        return ResponseEntity.ok(
                ApiResponse.<LoginUserResponse>builder()
                        .status("success")
                        .message("User logged in successfully")
                        .data(response)
                        .build()
        );
    }
}