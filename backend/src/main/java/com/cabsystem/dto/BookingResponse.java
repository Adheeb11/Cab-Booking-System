package com.cabsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * BookingResponse DTO - Response sent to frontend after booking creation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    
    private Long bookingId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String pickupLocation;
    private String dropLocation;
    private Double distance;
    private Double fare;
    private String status;
    private LocalDateTime bookingTime;
    private Boolean ecoRide;
    private Double carbonSaved;
    
    // Cab details
    private Long cabId;
    private String cabNumber;
    private String cabType;
    private Boolean isElectric;
    
    // Driver details
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private Double driverRating;
    
    // Payment details
    private String paymentMethod;
    private String paymentStatus;
    private String paymentMessage;
    
    private String message;
}
