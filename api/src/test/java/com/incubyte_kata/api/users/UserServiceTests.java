package com.incubyte_kata.api.users;

import com.incubyte_kata.api.core.exception.DuplicateResourceException;
import com.incubyte_kata.api.core.exception.ResourceNotFoundException;
import com.incubyte_kata.api.core.security.JwtTokenService;
import com.incubyte_kata.api.users.dto.LoginUserRequest;
import com.incubyte_kata.api.users.dto.LoginUserResponse;
import com.incubyte_kata.api.users.dto.RegisterUserRequest;
import com.incubyte_kata.api.users.dto.UserResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    UserRepository userRepository;

    @Mock
    UserMapper userMapper;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtTokenService jwtTokenService;

    @InjectMocks
    UserService userService;

    @Test
    void registerUser_ShouldSaveAndReturnUserEntity() {
        // Arrange
        RegisterUserRequest request = new RegisterUserRequest(
                "Rut Koticha", "koticharut@gmail.com", "P@ssw0rd", "P@ssw0rd"
        );
        UserEntity mockUser = new UserEntity();
        UserResponse mockResponse = new UserResponse(
                1L,
                "Rut Koticha",
                "koticharut@gmail.com",
                UserRole.USER
        );

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(userMapper.toEntity(request)).thenReturn(mockUser);
        when(passwordEncoder.encode(request.password())).thenReturn("hashed_password");
        when(userRepository.save(any(UserEntity.class))).thenReturn(mockUser);
        when(userMapper.toResponse(mockUser)).thenReturn(mockResponse);

        // Act
        UserResponse response = userService.registerUser(request);

        // Assert
        assertNotNull(response);
        assertEquals("koticharut@gmail.com", response.email());
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
    void registerUser_ShouldThrowException_WhenEmailIsAlreadyRegistered() {
        // Arrange
        RegisterUserRequest request = new RegisterUserRequest(
                "Rut Koticha",
                "koticharut@gmail.com",
                "P@ssw0rd",
                "P@ssw0rd"
        );
        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class, () -> userService.registerUser(request),
                "Expected duplicate resource exception for duplicate email");
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void registerUser_ShouldThrowException_WhenPasswordAndConfirmPasswordAreDifferent() {
        // Arrange
        RegisterUserRequest request = new RegisterUserRequest(
                "Rut Koticha", "koticharut@gmail.com", "P@ssw0rd", "password123"
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(request),
                "Expected exception for password mismatch");
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void registerUser_ShouldThrowException_WhenInputIsNotValid() {
        // Arrange
        RegisterUserRequest request = new RegisterUserRequest(
                "rk", "invalid-email", "pass", "pass"
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(request));
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void loginUser_ShouldReturnUserEntity_WhenCredentialsAreValid() {
        // Arrange
        LoginUserRequest request = new LoginUserRequest("koticharut@gmail.com", "P@ssw0rd");
        UserEntity mockUser = new UserEntity();
        mockUser.setPasswordHash("hashed_password");
        UserResponse mockResponse = new UserResponse(
                1L,
                "Rut Koticha",
                "koticharut@gmail.com",
                UserRole.USER
        );

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(request.password(), mockUser.getPasswordHash())).thenReturn(true);
        when(userMapper.toResponse(mockUser)).thenReturn(mockResponse);
        when(jwtTokenService.generateToken(mockUser)).thenReturn("mocked-jwt-token");

        // Act
        LoginUserResponse response = userService.loginUser(request);

        // Assert
        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.token());
        assertEquals("koticharut@gmail.com", response.userData().email());
    }

    @Test
    void loginUser_ShouldThrowException_WhenCredentialsAreInvalid() {
        // Arrange
        LoginUserRequest request = new LoginUserRequest("koticharut@gmail.com", "WrongPassword");
        UserEntity mockUser = new UserEntity();
        mockUser.setPasswordHash("hashed_password");

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(request.password(), mockUser.getPasswordHash())).thenReturn(false);

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> userService.loginUser(request),
                "Expected bad credentials exception for invalid credentials");
    }

    @Test
    void loginUser_ShouldThrowException_WhenUserDoesNotExist() {
        // Arrange
        LoginUserRequest request = new LoginUserRequest("unknown@gmail.com", "P@ssw0rd");
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.loginUser(request),
                "Expected resource not found exception for non-existent user");
    }
}
