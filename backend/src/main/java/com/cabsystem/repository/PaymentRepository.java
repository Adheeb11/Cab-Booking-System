package com.cabsystem.repository;

import com.cabsystem.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * PaymentRepository - Data Access Layer for Payment entity
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    /**
     * Find payment by booking ID
     */
    Optional<Payment> findByBooking_BookingId(Long bookingId);
    
    /**
     * Find payments by status
     */
    List<Payment> findByPaymentStatus(String status);
    
    /**
     * Find all successful payments
     */
    default List<Payment> findSuccessfulPayments() {
        return findByPaymentStatus("SUCCESS");
    }
    
    /**
     * Find all failed payments
     */
    default List<Payment> findFailedPayments() {
        return findByPaymentStatus("FAILED");
    }
}
