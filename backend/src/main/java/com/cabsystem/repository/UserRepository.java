package com.cabsystem.repository;

import com.cabsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * UserRepository - Data Access Layer for User entity
 * Extends JpaRepository for automatic CRUD operations
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email
     * Used for login and duplicate email check
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Find user by phone number
     */
    Optional<User> findByPhone(String phone);
}
