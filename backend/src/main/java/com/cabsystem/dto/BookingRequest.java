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
    private Double distance;
    private Boolean ecoRide;
    private String paymentMethod;  // UPI, CARD, CASH
    
    // Payment-specific fields
    private String upiId;              // For UPI payments
    private String cardNumber;         // For Card payments
    private String cardType;           // CREDIT/DEBIT
    private String bankName;           // For Card payments
    private String cardHolderName;     // For Card payments
    private Double receivedAmount;     // For Cash payments
    private String collectedBy;        // For Cash payments (driver name)
}
