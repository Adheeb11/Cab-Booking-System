package com.cabsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AuthResponse DTO - Response after login/registration
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;  // USER or ADMIN
    private String message;
    private boolean success;
}
