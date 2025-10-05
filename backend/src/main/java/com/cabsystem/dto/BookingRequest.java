package com.cabsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * BookingRequest DTO - Data Transfer Object for booking creation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    
    private Long userId;
    private String pickupLocation;
    private String dropLocation;
    
    // Location coordinates (for OpenStreetMap integration)
    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double dropLatitude;
    private Double dropLongitude;
    
    private Double distance;
    private String bookingTime;        // Booking time string from frontend
    private String cabType;            // sedan, suv, luxury, etc.
    private Double fare;               // Pre-calculated fare from frontend
    private Boolean ecoRide;
    private String paymentMethod;      // UPI, CARD, CASH
    private String status;             // PENDING, CONFIRMED, etc.
    
    // Payment-specific fields
    private String upiId;              // For UPI payments
    private String cardNumber;         // For Card payments
    private String cardType;           // CREDIT/DEBIT
    private String bankName;           // For Card payments
    private String cardHolderName;     // For Card payments
    private Double receivedAmount;     // For Cash payments
    private String collectedBy;        // For Cash payments (driver name)
}
