package com.cabsystem.controller;

import com.cabsystem.entity.Cab;
import com.cabsystem.repository.CabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * CabController - REST API endpoints for cab management
 */
@RestController
@RequestMapping("/api/cabs")
@CrossOrigin(origins = "*")
public class CabController {
    
    @Autowired
    private CabRepository cabRepository;
    
    /**
     * Get all cabs
     * GET /api/cabs
     */
    @GetMapping
    public ResponseEntity<List<Cab>> getAllCabs() {
        try {
            List<Cab> cabs = cabRepository.findAll();
            return ResponseEntity.ok(cabs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get available cabs
     * GET /api/cabs/available
     */
    @GetMapping("/available")
    public ResponseEntity<List<Cab>> getAvailableCabs() {
        try {
            List<Cab> cabs = cabRepository.findByIsAvailableTrue();
            return ResponseEntity.ok(cabs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get eco-friendly (electric) cabs
     * GET /api/cabs/eco
     */
    @GetMapping("/eco")
    public ResponseEntity<List<Cab>> getEcoCabs() {
        try {
            List<Cab> cabs = cabRepository.findByIsElectricTrueAndIsAvailableTrue();
            return ResponseEntity.ok(cabs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get cab by ID
     * GET /api/cabs/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cab> getCabById(@PathVariable Long id) {
        try {
            Optional<Cab> cab = cabRepository.findById(id);
            return cab.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get cabs by type
     * GET /api/cabs/type/{type}
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Cab>> getCabsByType(@PathVariable String type) {
        try {
            List<Cab> cabs = cabRepository.findByCabType(type);
            return ResponseEntity.ok(cabs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create new cab
     * POST /api/cabs
     */
    @PostMapping
    public ResponseEntity<Cab> createCab(@RequestBody Cab cab) {
        try {
            Cab savedCab = cabRepository.save(cab);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCab);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update cab availability
     * PATCH /api/cabs/{id}/availability
     */
    @PatchMapping("/{id}/availability")
    public ResponseEntity<Cab> updateCabAvailability(
            @PathVariable Long id, 
            @RequestParam Boolean available) {
        try {
            Optional<Cab> cabOpt = cabRepository.findById(id);
            if (cabOpt.isPresent()) {
                Cab cab = cabOpt.get();
                cab.setIsAvailable(available);
                Cab updatedCab = cabRepository.save(cab);
                return ResponseEntity.ok(updatedCab);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete cab
     * DELETE /api/cabs/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCab(@PathVariable Long id) {
        try {
            if (cabRepository.existsById(id)) {
                cabRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/cabs/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Cab API is running!");
    }
}
