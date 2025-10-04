package com.cabsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LoginRequest DTO - For user/driver login
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    private String email;
    private String password;
}
