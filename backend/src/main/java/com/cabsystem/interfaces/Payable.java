package com.cabsystem.interfaces;

/**
 * Payable Interface - Demonstrates ABSTRACTION
 * All payment-related classes should implement this interface
 */
public interface Payable {
    
    /**
     * Process the payment
     * @return Payment status message
     */
    String processPayment();
    
    /**
     * Get payment details
     * @return Payment details string
     */
    String getPaymentDetails();
    
    /**
     * Validate payment amount
     * @return true if valid, false otherwise
     */
    boolean isValidAmount();
}
