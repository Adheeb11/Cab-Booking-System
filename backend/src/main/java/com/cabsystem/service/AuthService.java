package com.cabsystem.service;

import com.cabsystem.dto.AuthResponse;
import com.cabsystem.dto.LoginRequest;
import com.cabsystem.dto.RegisterRequest;
import com.cabsystem.entity.User;
import com.cabsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

/**
 * AuthService - Handles user authentication and registration
 */
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Register a new user
     */
    public AuthResponse register(RegisterRequest request) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return AuthResponse.builder()
                    .success(false)
                    .message("Email already registered!")
                    .build();
            }
            
            // Create new user
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setAddress(request.getAddress());
            user.setPassword(hashPassword(request.getPassword()));
            user.setRole("USER");  // Default role for registration
            
            // Save to database
            User savedUser = userRepository.save(user);
            
            // Return success response
            return AuthResponse.builder()
                .userId(savedUser.getUserId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .address(savedUser.getAddress())
                .role(savedUser.getRole())
                .message("Registration successful!")
                .success(true)
                .build();
                
        } catch (Exception e) {
            return AuthResponse.builder()
                .success(false)
                .message("Registration failed: " + e.getMessage())
                .build();
        }
    }
    
    /**
     * Login user
     */
    public AuthResponse login(LoginRequest request) {
        try {
            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            
            if (userOpt.isEmpty()) {
                return AuthResponse.builder()
                    .success(false)
                    .message("Invalid email or password!")
                    .build();
            }
            
            User user = userOpt.get();
            String hashedPassword = hashPassword(request.getPassword());
            
            // Verify password
            if (!user.getPassword().equals(hashedPassword)) {
                return AuthResponse.builder()
                    .success(false)
                    .message("Invalid email or password!")
                    .build();
            }
            
            // Return success response
            return AuthResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole())
                .message("Login successful!")
                .success(true)
                .build();
                
        } catch (Exception e) {
            return AuthResponse.builder()
                .success(false)
                .message("Login failed: " + e.getMessage())
                .build();
        }
    }
    
    /**
     * Hash password using SHA-256
     */
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
