# 🧪 Testing Guide

Comprehensive guide to test all features of the Cab Booking System.

## Prerequisites

- ✅ Backend running on http://localhost:8080
- ✅ Frontend running on http://localhost:3000
- ✅ MySQL database with seed data

## Test Suite

### 1. Backend API Testing

#### Test 1.1: Health Check
```bash
curl http://localhost:8080/api/bookings
```
**Expected:** "Booking API is running! 🚕"

#### Test 1.2: Get All Users
```bash
curl http://localhost:8080/api/users
```
**Expected:** JSON array with 3 users

#### Test 1.3: Get Available Cabs
```bash
curl http://localhost:8080/api/cabs/available
```
**Expected:** JSON array with 5 available cabs

#### Test 1.4: Get Eco-Friendly Cabs
```bash
curl http://localhost:8080/api/cabs/eco
```
**Expected:** JSON array with 3 electric cabs

#### Test 1.5: Create Normal Booking (UPI)
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "pickupLocation": "Airport",
    "dropLocation": "Hotel Grand",
    "distance": 15.5,
    "paymentMethod": "UPI",
    "upiId": "john@upi",
    "ecoRide": false
  }'
```
**Expected:** Booking response with booking ID

#### Test 1.6: Create Eco-Friendly Booking
```bash
curl -X POST http://localhost:8080/api/bookings/eco \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "pickupLocation": "Home",
    "dropLocation": "Office",
    "distance": 10.0,
    "paymentMethod": "CARD",
    "cardNumber": "1234",
    "cardType": "CREDIT",
    "bankName": "HDFC",
    "ecoRide": true
  }'
```
**Expected:** Booking with carbonSaved > 0

#### Test 1.7: Get User Bookings
```bash
curl http://localhost:8080/api/bookings/1
```
**Expected:** Array of bookings for user 1

---

### 2. Frontend UI Testing

#### Test 2.1: Landing Page
1. Open http://localhost:3000
2. **Verify:**
   - ✅ Header with logo
   - ✅ Hero section
   - ✅ 3 feature cards
   - ✅ "Book a Ride" button
   - ✅ "My Bookings" button
   - ✅ Statistics section
   - ✅ Footer

#### Test 2.2: Book Normal Ride (UPI Payment)
1. Click "Book a Ride Now"
2. Fill form:
   - Pickup: "Railway Station"
   - Drop: "City Mall"
   - Distance: "8.5"
   - Payment Method: "UPI"
   - UPI ID: "test@paytm"
3. Click "Confirm Booking"
4. **Verify:**
   - ✅ Redirect to booking summary
   - ✅ Green success banner
   - ✅ Booking details displayed
   - ✅ Cab and driver information
   - ✅ Payment status shown
   - ✅ Total fare calculated correctly

#### Test 2.3: Book Eco-Friendly Ride (Card Payment)
1. Click "Book a Ride Now"
2. Fill form:
   - Pickup: "Home"
   - Drop: "Airport"
   - Distance: "25"
   - **Check "Book Eco-Friendly Ride"**
   - Payment Method: "Card"
   - Card Number: "5678"
   - Card Type: "DEBIT"
   - Bank: "SBI"
3. Click "Confirm Booking"
4. **Verify:**
   - ✅ EV cab assigned (if available)
   - ✅ Green eco-badge on summary page
   - ✅ Carbon saved displayed
   - ✅ Carbon amount > 0
   - ✅ "Eco-Friendly Ride!" message

#### Test 2.4: Book with Cash Payment
1. Click "Book a Ride Now"
2. Fill form:
   - Pickup: "Park"
   - Drop: "Restaurant"
   - Distance: "5.5"
   - Payment Method: "Cash"
   - Amount Received: "100"
3. Click "Confirm Booking"
4. **Verify:**
   - ✅ Booking created
   - ✅ Cash payment method shown

#### Test 2.5: View Bookings
1. Click "My Bookings" (or navigate to http://localhost:3000/my-bookings)
2. **Verify:**
   - ✅ All bookings displayed
   - ✅ User selector works
   - ✅ Booking cards show all details
   - ✅ Eco-rides have green badge
   - ✅ Carbon savings shown for eco-rides
   - ✅ Summary statistics at bottom

---

### 3. OOP Concepts Verification

#### Test 3.1: Encapsulation
- **Check:** All entity fields are private
- **Location:** `backend/src/main/java/com/cabsystem/entity/*.java`
- **Verify:** Lombok @Data annotation generates getters/setters

#### Test 3.2: Inheritance
- **Check:** Payment class hierarchy
- **Files to review:**
  - `Payment.java` (abstract parent)
  - `UPIPayment.java` (child)
  - `CardPayment.java` (child)
  - `CashPayment.java` (child)
- **Database:** Check `payments` table has `payment_type` discriminator column

#### Test 3.3: Polymorphism
- **Test:** Create bookings with different payment methods
- **Verify:** `processPayment()` outputs different messages for UPI/Card/Cash
- **Check backend logs:** Look for payment processing messages

#### Test 3.4: Abstraction
- **Check:** Payment has abstract `processPayment()` method
- **Verify:** Cannot instantiate Payment directly
- **Check:** Payable interface exists

#### Test 3.5: Composition
- **Check:** Booking entity has User, Cab, and Driver
- **Database:** Verify foreign key relationships in bookings table
- **Test:** Create booking and verify all relationships are saved

---

### 4. Advanced Features Testing

#### Test 4.1: Collections Usage
- **Check:** `BookingService.java`
- **Verify:**
  - HashMap for caching cabs
  - ArrayList for recent bookings
- **Test:** Create multiple bookings and check caching works

#### Test 4.2: Multithreading
- **Test:** Create booking and check if response returns immediately
- **Verify:** Payment processing happens asynchronously
- **Check logs:** Payment logs appear after booking confirmation

#### Test 4.3: File Logging
- **Location:** `logs/booking-logs.txt`
- **Test:** Create several bookings
- **Verify:** Each booking is logged to file with timestamp

#### Test 4.4: Carbon Savings Calculation
- **Test:** Book eco-ride with 10 km distance
- **Expected:** carbonSaved = 10 × 0.10 = 1.0 kg CO₂
- **Formula:** distance × (0.12 - 0.02)

---

### 5. Edge Cases & Error Handling

#### Test 5.1: Invalid User ID
```bash
curl http://localhost:8080/api/bookings/999
```
**Expected:** Empty array or error message

#### Test 5.2: No Available Cabs
- **Setup:** Set all cabs to `is_available = false`
- **Test:** Try to book a ride
- **Expected:** Error message "No cabs available"

#### Test 5.3: Missing Required Fields
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "pickupLocation": "Test"
  }'
```
**Expected:** Validation error

#### Test 5.4: Negative Distance
- **Test:** Enter -5 in distance field
- **Expected:** HTML5 validation prevents submission

#### Test 5.5: Zero Distance
- **Test:** Enter 0 in distance field
- **Expected:** Validation error (min="0.1")

---

### 6. Database Verification

#### Test 6.1: Check Users Table
```sql
SELECT * FROM users;
```
**Expected:** 3 users

#### Test 6.2: Check Drivers Table
```sql
SELECT * FROM drivers WHERE available = true;
```
**Expected:** 5 available drivers

#### Test 6.3: Check Cabs Table
```sql
SELECT * FROM cabs WHERE is_electric = true;
```
**Expected:** 3 electric cabs

#### Test 6.4: Check Bookings After Tests
```sql
SELECT 
    b.booking_id,
    u.name as user_name,
    c.cab_number,
    b.fare,
    b.eco_ride,
    b.carbon_saved
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN cabs c ON b.cab_id = c.cab_id;
```
**Expected:** All test bookings listed

#### Test 6.5: Check Payments Table
```sql
SELECT 
    p.payment_id,
    p.payment_type,
    p.amount,
    p.payment_status
FROM payments p;
```
**Expected:** Payment records match bookings

#### Test 6.6: Verify Single Table Inheritance
```sql
DESCRIBE payments;
```
**Expected:** Columns for all payment types in single table

---

### 7. Performance Testing

#### Test 7.1: Multiple Concurrent Bookings
1. Open multiple browser tabs
2. Submit bookings simultaneously
3. **Verify:** All bookings processed without conflicts

#### Test 7.2: Response Time
- **Measure:** Time from form submission to confirmation
- **Expected:** < 2 seconds

#### Test 7.3: Database Query Performance
```sql
EXPLAIN SELECT * FROM bookings WHERE user_id = 1;
```
**Verify:** Query uses index

---

### 8. Cross-Browser Testing

Test on multiple browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari (if available)

**Verify:** UI renders correctly on all browsers

---

### 9. Mobile Responsiveness

1. Open http://localhost:3000
2. Resize browser to mobile width (375px)
3. **Verify:**
   - ✅ Layout adapts to mobile
   - ✅ Forms are usable
   - ✅ Buttons are clickable
   - ✅ Text is readable

---

### 10. Integration Testing Checklist

- [ ] Frontend connects to backend successfully
- [ ] CORS is properly configured
- [ ] API calls return expected data
- [ ] Error messages display correctly
- [ ] Loading states work properly
- [ ] Navigation between pages works
- [ ] Session storage persists booking data
- [ ] All links work correctly

---

## Test Results Template

| Test | Status | Notes |
|------|--------|-------|
| Backend Health Check | ✅ | API responding |
| Get Users | ✅ | 3 users returned |
| Get Available Cabs | ✅ | 5 cabs returned |
| Create Normal Booking | ✅ | Booking ID: 1 |
| Create Eco Booking | ✅ | Carbon saved: 1.5 kg |
| View Bookings | ✅ | All bookings displayed |
| UPI Payment | ✅ | Polymorphism working |
| Card Payment | ✅ | Polymorphism working |
| Cash Payment | ✅ | Polymorphism working |
| File Logging | ✅ | Logs created |
| Carbon Calculation | ✅ | Correct formula |

---

## Common Issues & Solutions

### Issue: "Connection refused"
**Solution:** Ensure backend is running on port 8080

### Issue: "CORS error"
**Solution:** Check CORS configuration in `CorsConfig.java`

### Issue: "No cabs available"
**Solution:** Run seed data script or restart backend

### Issue: Frontend not updating
**Solution:** Clear browser cache, restart dev server

### Issue: Database connection error
**Solution:** Verify MySQL credentials in `application.properties`

---

## Automated Testing (Future Enhancement)

Consider adding:
- JUnit tests for backend services
- Jest tests for React components
- Integration tests with TestContainers
- E2E tests with Cypress or Selenium

---

**🎉 Happy Testing!**

Report any bugs or issues for continuous improvement.
