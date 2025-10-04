package com.cabsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * UPIPayment - Demonstrates INHERITANCE and POLYMORPHISM
 * Extends Payment abstract class
 */
@Entity
@DiscriminatorValue("UPI")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class UPIPayment extends Payment {
    
    @Column(name = "upi_id")
    private String upiId;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(name = "upi_provider")
    private String upiProvider;  // PhonePe, GooglePay, Paytm, etc.
    
    /**
     * POLYMORPHISM - Overrides abstract method from Payment class
     * Specific implementation for UPI payments
     */
    @Override
    public String processPayment() {
        // Simulate UPI payment processing
        if (isValidAmount() && upiId != null && !upiId.isEmpty()) {
            markAsSuccess();
            this.transactionId = "UPI" + System.currentTimeMillis();
            return String.format("UPI Payment Processed Successfully! UPI ID: %s, Transaction: %s", 
                upiId, transactionId);
        } else {
            markAsFailed();
            return "UPI Payment Failed: Invalid UPI ID or amount";
        }
    }
    
    /**
     * Validate UPI ID format
     */
    public boolean isValidUpiId() {
        return upiId != null && upiId.contains("@");
    }
    
    /**
     * Get masked UPI ID for display
     */
    public String getMaskedUpiId() {
        if (upiId != null && upiId.contains("@")) {
            String[] parts = upiId.split("@");
            String username = parts[0];
            if (username.length() > 3) {
                return username.substring(0, 3) + "***@" + parts[1];
            }
        }
        return "***@***";
    }
}
