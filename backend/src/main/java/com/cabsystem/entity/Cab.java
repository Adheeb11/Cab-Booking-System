package com.cabsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Cab Entity - Demonstrates ENCAPSULATION and COMPOSITION
 * Cab "has-a" Driver (Composition)
 */
@Entity
@Table(name = "cabs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cab {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cabId;
    
    @Column(nullable = false, unique = true)
    private String cabNumber;
    
    @Column(nullable = false)
    private String cabType;  // Sedan, SUV, Hatchback
    
    @Column(nullable = false)
    private Double ratePerKm;
    
    @Column(nullable = false)
    private Boolean isElectric;
    
    @Column(nullable = false)
    private Integer seats;
    
    @Column(nullable = false)
    private Boolean isAvailable;
    
    // COMPOSITION: Cab has-a Driver
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;
    
    /**
     * Business method - Calculate fare based on distance
     */
    public Double calculateFare(Double distance) {
        if (distance == null || distance <= 0) {
            return 0.0;
        }
        return this.ratePerKm * distance;
    }
    
    /**
     * Check if cab is eco-friendly
     */
    public boolean isEcoFriendly() {
        return this.isElectric != null && this.isElectric;
    }
    
    /**
     * Update availability status
     */
    public void updateAvailability(boolean status) {
        this.isAvailable = status;
    }
}
