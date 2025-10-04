package com.cabsystem.repository;

import com.cabsystem.entity.Cab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * CabRepository - Data Access Layer for Cab entity
 */
@Repository
public interface CabRepository extends JpaRepository<Cab, Long> {
    
    /**
     * Find all available cabs
     */
    List<Cab> findByIsAvailableTrue();
    
    /**
     * Find eco-friendly (electric) cabs that are available
     */
    List<Cab> findByIsElectricTrueAndIsAvailableTrue();
    
    /**
     * Find cabs by type
     */
    List<Cab> findByCabType(String cabType);
    
    /**
     * Find cab by cab number
     */
    Optional<Cab> findByCabNumber(String cabNumber);
    
    /**
     * Find cabs by minimum seats
     */
    List<Cab> findBySeatsGreaterThanEqual(Integer seats);
}
