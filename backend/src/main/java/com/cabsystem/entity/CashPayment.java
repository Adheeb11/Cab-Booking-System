package com.cabsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CashPayment - Demonstrates INHERITANCE and POLYMORPHISM
 * Extends Payment abstract class
 */
@Entity
@DiscriminatorValue("CASH")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CashPayment extends Payment {
    
    @Column(name = "received_amount")
    private Double receivedAmount;
    
    @Column(name = "change_returned")
    private Double changeReturned;
    
    @Column(name = "collected_by")
    private String collectedBy;  // Driver name
    
    @Column(name = "receipt_number")
    private String receiptNumber;
    
    /**
     * POLYMORPHISM - Overrides abstract method from Payment class
     * Specific implementation for Cash payments
     */
    @Override
    public String processPayment() {
        // Simulate cash payment processing
        if (isValidAmount() && receivedAmount != null && receivedAmount >= getAmount()) {
            calculateChange();
            markAsSuccess();
            this.receiptNumber = "CASH" + System.currentTimeMillis();
            return String.format("Cash Payment Received! Amount: ₹%.2f, Change: ₹%.2f, Receipt: %s", 
                receivedAmount, changeReturned, receiptNumber);
        } else {
            markAsFailed();
            return "Cash Payment Failed: Insufficient amount received";
        }
    }
    
    /**
     * Calculate change to be returned
     */
    public void calculateChange() {
        if (receivedAmount != null && getAmount() != null) {
            this.changeReturned = receivedAmount - getAmount();
            if (this.changeReturned < 0) {
                this.changeReturned = 0.0;
            }
        } else {
            this.changeReturned = 0.0;
        }
    }
    
    /**
     * Check if exact amount received
     */
    public boolean isExactAmount() {
        return receivedAmount != null && getAmount() != null && 
               Math.abs(receivedAmount - getAmount()) < 0.01;
    }
    
    /**
     * Check if change is required
     */
    public boolean requiresChange() {
        return changeReturned != null && changeReturned > 0;
    }
}
