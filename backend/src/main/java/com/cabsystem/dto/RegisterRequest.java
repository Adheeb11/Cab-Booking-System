package com.cabsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RegisterRequest DTO - For new user registration
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    private String name;
    private String email;
    private String phone;
    private String address;
    private String password;
}
