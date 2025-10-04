package com.cabsystem.repository;

import com.cabsystem.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * DriverRepository - Data Access Layer for Driver entity
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    /**
     * Find driver by email
     */
    Optional<Driver> findByEmail(String email);
    
    /**
     * Find all available drivers
     */
    List<Driver> findByAvailableTrue();
    
    /**
     * Find drivers by rating greater than or equal to threshold
     */
    List<Driver> findByRatingGreaterThanEqual(Double rating);
    
    /**
     * Find driver by license number
     */
    Optional<Driver> findByLicenseNumber(String licenseNumber);
}
