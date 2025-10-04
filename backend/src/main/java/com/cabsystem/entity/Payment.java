package com.cabsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Payment Abstract Class - Demonstrates ABSTRACTION and INHERITANCE
 * This is the parent class for all payment types
 * 
 * OOP Concepts Demonstrated:
 * 1. ABSTRACTION - Contains abstract method processPayment()
 * 2. INHERITANCE - Parent class for UPIPayment, CardPayment, CashPayment
 * 3. ENCAPSULATION - Private fields with getters/setters
 */
@Entity
@Table(name = "payments")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "payment_type", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private String paymentStatus;  // SUCCESS, PENDING, FAILED
    
    @Column(nullable = false)
    private LocalDateTime transactionTime;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    /**
     * ABSTRACT METHOD - Must be implemented by all child classes
     * This demonstrates POLYMORPHISM - different implementations in each subclass
     */
    public abstract String processPayment();
    
    /**
     * CONCRETE METHOD - Inherited by all child classes
     * Common behavior shared across all payment types
     */
    public String getPaymentDetails() {
        return String.format("Payment ID: %d, Amount: ₹%.2f, Status: %s", 
            paymentId, amount, paymentStatus);
    }
    
    /**
     * Validate payment amount
     */
    public boolean isValidAmount() {
        return amount != null && amount > 0;
    }
    
    /**
     * Mark payment as successful
     */
    public void markAsSuccess() {
        this.paymentStatus = "SUCCESS";
        this.transactionTime = LocalDateTime.now();
    }
    
    /**
     * Mark payment as failed
     */
    public void markAsFailed() {
        this.paymentStatus = "FAILED";
        this.transactionTime = LocalDateTime.now();
    }
}
