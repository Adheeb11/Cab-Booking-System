package com.cabsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CardPayment - Demonstrates INHERITANCE and POLYMORPHISM
 * Extends Payment abstract class
 */
@Entity
@DiscriminatorValue("CARD")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CardPayment extends Payment {
    
    @Column(name = "card_number")
    private String cardNumber;
    
    @Column(name = "card_type")
    private String cardType;  // CREDIT, DEBIT
    
    @Column(name = "bank_name")
    private String bankName;
    
    @Column(name = "card_holder_name")
    private String cardHolderName;
    
    @Column(name = "auth_code")
    private String authCode;
    
    /**
     * POLYMORPHISM - Overrides abstract method from Payment class
     * Specific implementation for Card payments
     */
    @Override
    public String processPayment() {
        // Simulate card payment processing
        if (isValidAmount() && isValidCardNumber()) {
            markAsSuccess();
            this.authCode = "AUTH" + System.currentTimeMillis();
            return String.format("Card Payment Processed! Card: ****%s, Bank: %s, Auth: %s", 
                getMaskedCardNumber(), bankName, authCode);
        } else {
            markAsFailed();
            return "Card Payment Failed: Invalid card details or amount";
        }
    }
    
    /**
     * Validate card number (simple check - 16 digits)
     */
    public boolean isValidCardNumber() {
        return cardNumber != null && cardNumber.length() == 16 && cardNumber.matches("\\d+");
    }
    
    /**
     * Get masked card number for security
     */
    public String getMaskedCardNumber() {
        if (cardNumber != null && cardNumber.length() == 16) {
            return cardNumber.substring(cardNumber.length() - 4);
        }
        return "****";
    }
    
    /**
     * Check if card is credit card
     */
    public boolean isCreditCard() {
        return "CREDIT".equalsIgnoreCase(cardType);
    }
}
