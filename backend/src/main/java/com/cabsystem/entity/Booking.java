package com.cabsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Booking Entity - Demonstrates COMPOSITION
 * Booking "has-a" User, Cab, and Driver (Composition)
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    
    // COMPOSITION: Booking has-a User
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String pickupLocation;
    
    @Column(nullable = false)
    private String dropLocation;
    
    @Column(nullable = false)
    private Double distance;
    
    @Column(nullable = false)
    private Double fare;
    
    @Column(nullable = false)
    private String status;  // PENDING, CONFIRMED, COMPLETED, CANCELLED
    
    @Column(nullable = false)
    private LocalDateTime bookingTime;
    
    @Column(nullable = false)
    private Boolean ecoRide;
    
    @Column(nullable = false)
    private Double carbonSaved;  // in kg CO2
    
    // COMPOSITION: Booking has-a Cab
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cab_id", nullable = false)
    private Cab cab;
    
    @Column(nullable = false)
    private String paymentMethod;  // UPI, CARD, CASH
    
    @Column(nullable = true, columnDefinition = "TEXT")
    private String paymentDetails;  // JSON string with payment info
    
    @Column(nullable = true)
    private String paymentStatus;  // SUCCESS, PENDING, FAILED
    
    /**
     * Calculate carbon savings for eco rides
     * Formula: distance * 0.10 kg CO2 per km saved
     */
    public void calculateCarbonSavings() {
        if (this.ecoRide && this.distance != null) {
            this.carbonSaved = this.distance * 0.10;
        } else {
            this.carbonSaved = 0.0;
        }
    }
    
    /**
     * Get booking summary
     */
    public String getBookingSummary() {
        return String.format("Booking #%d: %s to %s (%.2f km) - ₹%.2f", 
            bookingId, pickupLocation, dropLocation, distance, fare);
    }
    
    /**
     * Check if booking is confirmed
     */
    public boolean isConfirmed() {
        return "CONFIRMED".equalsIgnoreCase(this.status);
    }
}
