package com.cabsystem.controller;

import com.cabsystem.entity.*;
import com.cabsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin Controller - Provides admin panel APIs
 * All endpoints require admin authorization
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private CabRepository cabRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    /**
     * Get dashboard statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalUsers = userRepository.count();
            long totalDrivers = driverRepository.count();
            long totalCabs = cabRepository.count();
            long totalBookings = bookingRepository.count();
            
            // Calculate total revenue
            List<Payment> payments = paymentRepository.findAll();
            double totalRevenue = payments.stream()
                    .mapToDouble(Payment::getAmount)
                    .sum();
            
            // Count bookings by status
            List<Booking> allBookings = bookingRepository.findAll();
            long activeBookings = allBookings.stream()
                    .filter(b -> "CONFIRMED".equals(b.getStatus()) || "IN_PROGRESS".equals(b.getStatus()))
                    .count();
            long completedBookings = allBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()))
                    .count();
            
            // Count eco-friendly bookings
            long ecoBookings = allBookings.stream()
                    .filter(Booking::getEcoRide)
                    .count();
            
            // Calculate total carbon saved
            double totalCarbonSaved = allBookings.stream()
                    .filter(Booking::getEcoRide)
                    .mapToDouble(Booking::getCarbonSaved)
                    .sum();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalDrivers", totalDrivers);
            stats.put("totalCabs", totalCabs);
            stats.put("totalBookings", totalBookings);
            stats.put("totalRevenue", totalRevenue);
            stats.put("activeBookings", activeBookings);
            stats.put("completedBookings", completedBookings);
            stats.put("ecoBookings", ecoBookings);
            stats.put("totalCarbonSaved", totalCarbonSaved);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching stats: " + e.getMessage());
        }
    }
    
    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching users: " + e.getMessage());
        }
    }
    
    /**
     * Get all drivers
     */
    @GetMapping("/drivers")
    public ResponseEntity<?> getAllDrivers() {
        try {
            List<Driver> drivers = driverRepository.findAll();
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching drivers: " + e.getMessage());
        }
    }
    
    /**
     * Get all cabs
     */
    @GetMapping("/cabs")
    public ResponseEntity<?> getAllCabs() {
        try {
            List<Cab> cabs = cabRepository.findAll();
            return ResponseEntity.ok(cabs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching cabs: " + e.getMessage());
        }
    }
    
    /**
     * Get all bookings
     */
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching bookings: " + e.getMessage());
        }
    }
    
    /**
     * Get all payments
     */
    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments() {
        try {
            List<Payment> payments = paymentRepository.findAll();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching payments: " + e.getMessage());
        }
    }
    
    /**
     * Delete user by ID
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found with ID: " + id);
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user: " + e.getMessage());
        }
    }
    
    /**
     * Delete driver by ID
     */
    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        try {
            if (!driverRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Driver not found with ID: " + id);
            }
            driverRepository.deleteById(id);
            return ResponseEntity.ok("Driver deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting driver: " + e.getMessage());
        }
    }
    
    /**
     * Delete cab by ID
     */
    @DeleteMapping("/cabs/{id}")
    public ResponseEntity<?> deleteCab(@PathVariable Long id) {
        try {
            if (!cabRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Cab not found with ID: " + id);
            }
            cabRepository.deleteById(id);
            return ResponseEntity.ok("Cab deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting cab: " + e.getMessage());
        }
    }
    
    /**
     * Update booking status
     */
    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            booking.setStatus(status);
            bookingRepository.save(booking);
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating booking: " + e.getMessage());
        }
    }
    
    /**
     * Update cab availability
     */
    @PutMapping("/cabs/{id}/availability")
    public ResponseEntity<?> updateCabAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available) {
        try {
            Cab cab = cabRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cab not found"));
            
            cab.setIsAvailable(available);
            cabRepository.save(cab);
            
            return ResponseEntity.ok(cab);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating cab: " + e.getMessage());
        }
    }
    
    /**
     * Get revenue by payment method
     */
    @GetMapping("/revenue/by-method")
    public ResponseEntity<?> getRevenueByMethod() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            
            Map<String, Double> revenueByMethod = new HashMap<>();
            for (Booking booking : bookings) {
                String method = booking.getPaymentMethod();
                revenueByMethod.put(method, 
                    revenueByMethod.getOrDefault(method, 0.0) + booking.getFare());
            }
            
            return ResponseEntity.ok(revenueByMethod);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calculating revenue: " + e.getMessage());
        }
    }
}
