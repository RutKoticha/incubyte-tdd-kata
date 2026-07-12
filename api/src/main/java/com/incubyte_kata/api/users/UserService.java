package com.incubyte_kata.api.users;

import com.incubyte_kata.api.core.exception.DuplicateResourceException;
import com.incubyte_kata.api.core.exception.ResourceNotFoundException;
import com.incubyte_kata.api.core.security.JwtTokenService;
import com.incubyte_kata.api.users.dto.LoginUserRequest;
import com.incubyte_kata.api.users.dto.LoginUserResponse;
import com.incubyte_kata.api.users.dto.RegisterUserRequest;
import com.incubyte_kata.api.users.dto.UserResponse;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public UserResponse registerUser(RegisterUserRequest request) {
        log.debug("Registering new user");

        if(!Objects.equals(request.password(), request.confirmPassword())) {
            throw new BadCredentialsException("Password and Confirm password fields do not match");
        }

        if(userRepository.existsByEmail(request.email())) {
            log.warn("User registration failed: Duplicate email found");
            throw new DuplicateResourceException("User with same email already exists", "DUPLICATE_EMAIL_CONFLICT");
        }

        UserEntity userEntity = userMapper.toEntity(request);
        userEntity.setPasswordHash(passwordEncoder.encode(request.password()));

        UserEntity savedUser;

            savedUser = userRepository.save(userEntity);

        return userMapper.toResponse(savedUser);
    }

    public LoginUserResponse loginUser(LoginUserRequest request) {
        log.debug("Logging in user");
        UserEntity foundUser = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found", "USER_NOT_FOUND"));

        if (!passwordEncoder.matches(request.password(), foundUser.getPasswordHash())) {
            log.warn("User login failed: Invalid password");
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtTokenService.generateToken(foundUser);

        return new LoginUserResponse(token, userMapper.toResponse(foundUser));
    }
}
