package com.cabsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Driver Entity - Demonstrates ENCAPSULATION
 */
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String licenseNumber;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private Double rating;
    
    @Column(nullable = false)
    private Boolean available;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    /**
     * Business method - Update driver availability
     */
    public void setAvailabilityStatus(boolean status) {
        this.available = status;
    }
    
    /**
     * Check if driver is eligible (rating > 3.0)
     */
    public boolean isEligible() {
        return this.rating != null && this.rating >= 3.0;
    }
}
