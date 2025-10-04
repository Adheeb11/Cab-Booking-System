package com.cabsystem.config;

import com.cabsystem.entity.*;
import com.cabsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * DataInitializer - Seed initial data to the database
 * Runs automatically when the application starts
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private CabRepository cabRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only seed if database is empty
        if (userRepository.count() == 0) {
            seedUsers();
        }
        
        if (driverRepository.count() == 0) {
            seedDrivers();
        }
        
        if (cabRepository.count() == 0) {
            seedCabs();
        }
        
        System.out.println("✅ Database seeded successfully!");
    }
    
    /**
     * Seed users with default password: password123
     */
    private void seedUsers() {
        String hashedPassword = hashPassword("password123");
        String adminPassword = hashPassword("admin123");
        
        // Create admin user
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@cabsystem.com");
        admin.setPhone("9999999999");
        admin.setAddress("Admin Office, Cab System HQ");
        admin.setPassword(adminPassword);
        admin.setRole("ADMIN");
        
        User user1 = new User();
        user1.setName("John Doe");
        user1.setEmail("john@example.com");
        user1.setPhone("9876543210");
        user1.setAddress("123 Main St, New York");
        user1.setPassword(hashedPassword);
        user1.setRole("USER");
        
        User user2 = new User();
        user2.setName("Jane Smith");
        user2.setEmail("jane@example.com");
        user2.setPhone("9876543211");
        user2.setAddress("456 Park Ave, Los Angeles");
        user2.setPassword(hashedPassword);
        user2.setRole("USER");
        
        User user3 = new User();
        user3.setName("Mike Johnson");
        user3.setEmail("mike@example.com");
        user3.setPhone("9876543212");
        user3.setAddress("789 Oak Rd, Chicago");
        user3.setPassword(hashedPassword);
        user3.setRole("USER");
        
        userRepository.save(admin);
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        
        System.out.println("✅ Users seeded (User Password: password123, Admin Password: admin123)");
    }
    
    /**
     * Seed drivers with default password: driver123
     */
    private void seedDrivers() {
        String hashedPassword = hashPassword("driver123");
        
        Driver driver1 = new Driver();
        driver1.setName("Rajesh Kumar");
        driver1.setLicenseNumber("DL1234567");
        driver1.setPhone("9988776655");
        driver1.setRating(4.5);
        driver1.setAvailable(true);
        driver1.setEmail("rajesh@driver.com");
        driver1.setPassword(hashedPassword);
        
        Driver driver2 = new Driver();
        driver2.setName("Amit Sharma");
        driver2.setLicenseNumber("DL2345678");
        driver2.setPhone("9988776656");
        driver2.setRating(4.8);
        driver2.setAvailable(true);
        driver2.setEmail("amit@driver.com");
        driver2.setPassword(hashedPassword);
        
        Driver driver3 = new Driver();
        driver3.setName("Suresh Patel");
        driver3.setLicenseNumber("DL3456789");
        driver3.setPhone("9988776657");
        driver3.setRating(4.2);
        driver3.setAvailable(true);
        driver3.setEmail("suresh@driver.com");
        driver3.setPassword(hashedPassword);
        
        Driver driver4 = new Driver();
        driver4.setName("Vikram Singh");
        driver4.setLicenseNumber("DL4567890");
        driver4.setPhone("9988776658");
        driver4.setRating(4.7);
        driver4.setAvailable(true);
        driver4.setEmail("vikram@driver.com");
        driver4.setPassword(hashedPassword);
        
        Driver driver5 = new Driver();
        driver5.setName("Ravi Verma");
        driver5.setLicenseNumber("DL5678901");
        driver5.setPhone("9988776659");
        driver5.setRating(4.6);
        driver5.setAvailable(true);
        driver5.setEmail("ravi@driver.com");
        driver5.setPassword(hashedPassword);
        
        driverRepository.save(driver1);
        driverRepository.save(driver2);
        driverRepository.save(driver3);
        driverRepository.save(driver4);
        driverRepository.save(driver5);
        
        System.out.println("✅ Drivers seeded (Password: driver123)");
    }
    
    /**
     * Seed cabs with drivers
     */
    private void seedCabs() {
        // Get all drivers
        var drivers = driverRepository.findAll();
        
        if (drivers.size() < 5) {
            System.err.println("❌ Not enough drivers to seed cabs");
            return;
        }
        
        // Cab 1 - Electric Sedan
        Cab cab1 = new Cab();
        cab1.setCabNumber("DL-01-AB-1234");
        cab1.setCabType("Sedan");
        cab1.setRatePerKm(12.0);
        cab1.setIsElectric(true);
        cab1.setSeats(4);
        cab1.setIsAvailable(true);
        cab1.setDriver(drivers.get(0));
        
        // Cab 2 - Regular SUV
        Cab cab2 = new Cab();
        cab2.setCabNumber("DL-02-CD-5678");
        cab2.setCabType("SUV");
        cab2.setRatePerKm(15.0);
        cab2.setIsElectric(false);
        cab2.setSeats(6);
        cab2.setIsAvailable(true);
        cab2.setDriver(drivers.get(1));
        
        // Cab 3 - Electric Hatchback
        Cab cab3 = new Cab();
        cab3.setCabNumber("DL-03-EF-9012");
        cab3.setCabType("Hatchback");
        cab3.setRatePerKm(10.0);
        cab3.setIsElectric(true);
        cab3.setSeats(4);
        cab3.setIsAvailable(true);
        cab3.setDriver(drivers.get(2));
        
        // Cab 4 - Regular Sedan
        Cab cab4 = new Cab();
        cab4.setCabNumber("DL-04-GH-3456");
        cab4.setCabType("Sedan");
        cab4.setRatePerKm(12.0);
        cab4.setIsElectric(false);
        cab4.setSeats(4);
        cab4.setIsAvailable(true);
        cab4.setDriver(drivers.get(3));
        
        // Cab 5 - Electric SUV
        Cab cab5 = new Cab();
        cab5.setCabNumber("DL-05-IJ-7890");
        cab5.setCabType("SUV");
        cab5.setRatePerKm(15.0);
        cab5.setIsElectric(true);
        cab5.setSeats(7);
        cab5.setIsAvailable(true);
        cab5.setDriver(drivers.get(4));
        
        cabRepository.save(cab1);
        cabRepository.save(cab2);
        cabRepository.save(cab3);
        cabRepository.save(cab4);
        cabRepository.save(cab5);
        
        System.out.println("✅ Cabs seeded (3 Electric, 2 Regular)");
    }
    
    /**
     * Hash password using SHA-256
     */
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
