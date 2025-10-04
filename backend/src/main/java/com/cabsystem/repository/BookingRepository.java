package com.cabsystem.repository;

import com.cabsystem.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * BookingRepository - Data Access Layer for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    /**
     * Find all bookings by user ID
     */
    @Query("SELECT b FROM Booking b WHERE b.user.userId = :userId ORDER BY b.bookingTime DESC")
    List<Booking> findByUserId(Long userId);
    
    /**
     * Find all eco-friendly bookings
     */
    List<Booking> findByEcoRideTrue();
    
    /**
     * Find bookings by status
     */
    List<Booking> findByStatus(String status);
    
    /**
     * Find bookings by payment method
     */
    List<Booking> findByPaymentMethod(String paymentMethod);
    
    /**
     * Find bookings by cab ID
     */
    @Query("SELECT b FROM Booking b WHERE b.cab.cabId = :cabId")
    List<Booking> findByCabId(Long cabId);
    
    /**
     * Count total bookings by user
     */
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.user.userId = :userId")
    Long countByUserId(Long userId);
}
