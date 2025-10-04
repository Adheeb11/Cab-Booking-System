package com.cabsystem.service;

import com.cabsystem.dto.BookingRequest;
import com.cabsystem.dto.BookingResponse;
import com.cabsystem.entity.*;
import com.cabsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * BookingService - Main business logic with OOP concepts
 * 
 * OOP Concepts Demonstrated:
 * 1. COLLECTIONS - HashMap, ArrayList usage
 * 2. MULTITHREADING - CompletableFuture for async payment processing
 * 3. FILE I/O - Logging bookings to file
 */
@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CabRepository cabRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    // COLLECTION - HashMap to cache available cabs (OOP Concept #6)
    private Map<Long, Cab> availableCabsCache = new HashMap<>();
    
    // COLLECTION - ArrayList to store recent bookings (OOP Concept #6)
    private List<Booking> recentBookings = new ArrayList<>();
    
    private static final String LOG_FILE_PATH = "logs/booking-logs.txt";
    
    /**
     * Create a normal booking
     */
    public BookingResponse createBooking(BookingRequest request) {
        try {
            // Validate user
            User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Find available cab (use cache first)
            Cab cab = findAvailableCab(request.getEcoRide());
            if (cab == null) {
                return BookingResponse.builder()
                    .message("No cabs available at the moment")
                    .build();
            }
            
            // Calculate fare
            Double fare = calculateFare(request.getDistance(), cab.getRatePerKm());
            
            // Create booking
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setPickupLocation(request.getPickupLocation());
            booking.setDropLocation(request.getDropLocation());
            booking.setDistance(request.getDistance());
            booking.setFare(fare);
            booking.setStatus("CONFIRMED");
            booking.setBookingTime(LocalDateTime.now());
            booking.setEcoRide(request.getEcoRide() != null ? request.getEcoRide() : false);
            booking.setCab(cab);
            booking.setPaymentMethod(request.getPaymentMethod());
            
            // Calculate carbon savings for eco rides
            if (booking.getEcoRide()) {
                booking.calculateCarbonSavings();
            } else {
                booking.setCarbonSaved(0.0);
            }
            
            // Save booking
            Booking savedBooking = bookingRepository.save(booking);
            
            // Update cab availability
            cab.setIsAvailable(false);
            cabRepository.save(cab);
            
            // Add to recent bookings list (COLLECTION)
            recentBookings.add(savedBooking);
            
            // Process payment asynchronously (MULTITHREADING - OOP Concept #7)
            processPaymentAsync(savedBooking, request);
            
            // Log booking to file (FILE I/O - OOP Concept #8)
            logBookingToFile(savedBooking);
            
            // Build response
            return buildBookingResponse(savedBooking, "Booking created successfully!");
            
        } catch (Exception e) {
            return BookingResponse.builder()
                .message("Booking failed: " + e.getMessage())
                .build();
        }
    }
    
    /**
     * Create eco-friendly booking (prioritize EVs)
     */
    public BookingResponse createEcoBooking(BookingRequest request) {
        request.setEcoRide(true);
        return createBooking(request);
    }
    
    /**
     * Find available cab (with caching using HashMap)
     * Demonstrates COLLECTIONS (OOP Concept #6)
     */
    private Cab findAvailableCab(Boolean ecoRide) {
        List<Cab> cabs;
        
        if (ecoRide != null && ecoRide) {
            // Priority: Electric vehicles for eco rides
            cabs = cabRepository.findByIsElectricTrueAndIsAvailableTrue();
            
            // Fallback: Any available cab if no EVs
            if (cabs.isEmpty()) {
                cabs = cabRepository.findByIsAvailableTrue();
            }
        } else {
            cabs = cabRepository.findByIsAvailableTrue();
        }
        
        if (cabs.isEmpty()) {
            return null;
        }
        
        // Update cache (HashMap)
        Cab selectedCab = cabs.get(0);
        availableCabsCache.put(selectedCab.getCabId(), selectedCab);
        
        return selectedCab;
    }
    
    /**
     * Calculate fare based on distance and rate
     */
    private Double calculateFare(Double distance, Double ratePerKm) {
        if (distance == null || ratePerKm == null) {
            return 0.0;
        }
        Double baseFare = distance * ratePerKm;
        Double tax = baseFare * 0.05; // 5% tax
        return baseFare + tax;
    }
    
    /**
     * Process payment asynchronously using CompletableFuture
     * Demonstrates MULTITHREADING (OOP Concept #7)
     */
    private void processPaymentAsync(Booking booking, BookingRequest request) {
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(1000); // Simulate payment processing delay
                
                Payment payment = createPayment(booking, request);
                String paymentResult = payment.processPayment();
                
                // Save payment
                paymentRepository.save(payment);
                
                // Update booking payment status
                booking.setPaymentStatus(payment.getPaymentStatus());
                booking.setPaymentDetails(paymentResult);
                bookingRepository.save(booking);
                
                System.out.println("✅ Payment processed asynchronously: " + paymentResult);
                
            } catch (Exception e) {
                System.err.println("❌ Payment processing failed: " + e.getMessage());
                booking.setPaymentStatus("FAILED");
                bookingRepository.save(booking);
            }
        });
    }
    
    /**
     * Create payment object based on payment method
     * Demonstrates POLYMORPHISM - different payment types
     */
    private Payment createPayment(Booking booking, BookingRequest request) {
        Payment payment;
        
        switch (request.getPaymentMethod().toUpperCase()) {
            case "UPI":
                UPIPayment upiPayment = new UPIPayment();
                upiPayment.setUpiId(request.getUpiId());
                upiPayment.setUpiProvider("PhonePe");
                payment = upiPayment;
                break;
                
            case "CARD":
                CardPayment cardPayment = new CardPayment();
                cardPayment.setCardNumber(request.getCardNumber());
                cardPayment.setCardType(request.getCardType());
                cardPayment.setBankName(request.getBankName());
                cardPayment.setCardHolderName(request.getCardHolderName());
                payment = cardPayment;
                break;
                
            case "CASH":
                CashPayment cashPayment = new CashPayment();
                cashPayment.setReceivedAmount(request.getReceivedAmount());
                cashPayment.setCollectedBy(request.getCollectedBy());
                payment = cashPayment;
                break;
                
            default:
                throw new IllegalArgumentException("Invalid payment method");
        }
        
        payment.setAmount(booking.getFare());
        payment.setPaymentStatus("PENDING");
        payment.setTransactionTime(LocalDateTime.now());
        payment.setBooking(booking);
        
        return payment;
    }
    
    /**
     * Log booking to file
     * Demonstrates FILE I/O (OOP Concept #8)
     */
    private void logBookingToFile(Booking booking) {
        try {
            // Create logs directory if it doesn't exist
            File logDir = new File("logs");
            if (!logDir.exists()) {
                logDir.mkdirs();
            }
            
            // Open file in append mode
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE_PATH, true))) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String timestamp = booking.getBookingTime().format(formatter);
                
                String logEntry = String.format(
                    "[%s] Booking #%d | User: %s | From: %s | To: %s | Distance: %.2f km | " +
                    "Fare: ₹%.2f | Cab: %s | EcoRide: %s | Carbon Saved: %.2f kg%n",
                    timestamp,
                    booking.getBookingId(),
                    booking.getUser().getName(),
                    booking.getPickupLocation(),
                    booking.getDropLocation(),
                    booking.getDistance(),
                    booking.getFare(),
                    booking.getCab().getCabNumber(),
                    booking.getEcoRide() ? "YES" : "NO",
                    booking.getCarbonSaved()
                );
                
                writer.write(logEntry);
                writer.flush();
                
                System.out.println("📝 Booking logged to file: " + LOG_FILE_PATH);
            }
            
        } catch (IOException e) {
            System.err.println("❌ Failed to log booking to file: " + e.getMessage());
        }
    }
    
    /**
     * Get user bookings
     */
    public List<BookingResponse> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
            .map(booking -> buildBookingResponse(booking, null))
            .collect(Collectors.toList());
    }
    
    /**
     * Get all bookings
     */
    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
            .map(booking -> buildBookingResponse(booking, null))
            .collect(Collectors.toList());
    }
    
    /**
     * Build booking response DTO
     */
    private BookingResponse buildBookingResponse(Booking booking, String message) {
        return BookingResponse.builder()
            .bookingId(booking.getBookingId())
            .userId(booking.getUser().getUserId())
            .userName(booking.getUser().getName())
            .userEmail(booking.getUser().getEmail())
            .pickupLocation(booking.getPickupLocation())
            .dropLocation(booking.getDropLocation())
            .distance(booking.getDistance())
            .fare(booking.getFare())
            .status(booking.getStatus())
            .bookingTime(booking.getBookingTime())
            .ecoRide(booking.getEcoRide())
            .carbonSaved(booking.getCarbonSaved())
            .cabId(booking.getCab().getCabId())
            .cabNumber(booking.getCab().getCabNumber())
            .cabType(booking.getCab().getCabType())
            .isElectric(booking.getCab().getIsElectric())
            .driverId(booking.getCab().getDriver().getDriverId())
            .driverName(booking.getCab().getDriver().getName())
            .driverPhone(booking.getCab().getDriver().getPhone())
            .driverRating(booking.getCab().getDriver().getRating())
            .paymentMethod(booking.getPaymentMethod())
            .paymentStatus(booking.getPaymentStatus())
            .message(message)
            .build();
    }
    
    /**
     * Get cached cabs (demonstrates HashMap usage)
     */
    public Map<Long, Cab> getCachedCabs() {
        return new HashMap<>(availableCabsCache);
    }
    
    /**
     * Get recent bookings (demonstrates ArrayList usage)
     */
    public List<Booking> getRecentBookings() {
        return new ArrayList<>(recentBookings);
    }
}
