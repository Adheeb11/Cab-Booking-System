package com.cabsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application Class for Cab Booking System
 * 
 * This Spring Boot application demonstrates all 8 OOP concepts:
 * 1. Encapsulation - Entity classes with private fields
 * 2. Inheritance - Payment class hierarchy
 * 3. Polymorphism - processPayment() method overriding
 * 4. Abstraction - Payment abstract class and Payable interface
 * 5. Composition - Booking has-a User, Cab, Driver
 * 6. Collections - HashMap and ArrayList in BookingService
 * 7. Multithreading - CompletableFuture for async payment processing
 * 8. File I/O - Booking logs written to file
 */
@SpringBootApplication
public class CabBookingSystemApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CabBookingSystemApplication.class, args);
        
        System.out.println("\n" +
            "╔═══════════════════════════════════════════════════════════════╗\n" +
            "║                                                               ║\n" +
            "║         🚕 CAB BOOKING SYSTEM - BACKEND RUNNING 🚕           ║\n" +
            "║                                                               ║\n" +
            "║  Server Port: 8080                                            ║\n" +
            "║  API Base URL: http://localhost:8080/api                     ║\n" +
            "║                                                               ║\n" +
            "║  Available Endpoints:                                         ║\n" +
            "║  ├─ POST   /api/auth/register          (Register)            ║\n" +
            "║  ├─ POST   /api/auth/login             (Login)               ║\n" +
            "║  ├─ POST   /api/bookings               (Create Booking)      ║\n" +
            "║  ├─ POST   /api/bookings/eco           (Eco Booking)         ║\n" +
            "║  ├─ GET    /api/bookings/user/{id}     (User Bookings)       ║\n" +
            "║  ├─ GET    /api/users                  (All Users)           ║\n" +
            "║  ├─ GET    /api/cabs                   (All Cabs)            ║\n" +
            "║  └─ GET    /api/cabs/available         (Available Cabs)      ║\n" +
            "║                                                               ║\n" +
            "║  OOP Concepts Implemented: ✅ All 8                          ║\n" +
            "║  Database: MySQL (cab_booking_db)                            ║\n" +
            "║  Seed Data: ✅ 3 Users, 5 Drivers, 5 Cabs                   ║\n" +
            "║                                                               ║\n" +
            "║  Demo Login:                                                  ║\n" +
            "║  Email: john@example.com                                      ║\n" +
            "║  Password: password123                                        ║\n" +
            "║                                                               ║\n" +
            "╚═══════════════════════════════════════════════════════════════╝\n"
        );
    }
}
