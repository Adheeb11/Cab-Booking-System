# 📚 API Documentation

Complete REST API documentation for Cab Booking System Backend.

## Base URL

```
http://localhost:8080/api
```

---

## 🔐 Authentication APIs

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, New York",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, New York",
  "message": "Registration successful!",
  "success": true
}
```

**Error Response (400):**

```json
{
  "userId": null,
  "name": null,
  "email": null,
  "phone": null,
  "address": null,
  "message": "Email already registered!",
  "success": false
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, New York",
  "message": "Login successful!",
  "success": true
}
```

**Error Response (401):**

```json
{
  "userId": null,
  "name": null,
  "email": null,
  "phone": null,
  "address": null,
  "message": "Invalid email or password!",
  "success": false
}
```

---

### 3. Health Check

**Endpoint:** `GET /api/auth/check`

**Response (200):**

```
Auth API is running!
```

---

## 🚕 Booking APIs

### 1. Create Normal Booking

**Endpoint:** `POST /api/bookings`

**Request Body (UPI Payment):**

```json
{
  "userId": 1,
  "pickupLocation": "Times Square",
  "dropLocation": "Central Park",
  "distance": 5.0,
  "ecoRide": false,
  "paymentMethod": "UPI",
  "upiId": "john@paytm"
}
```

**Request Body (Card Payment):**

```json
{
  "userId": 1,
  "pickupLocation": "Times Square",
  "dropLocation": "Central Park",
  "distance": 5.0,
  "ecoRide": false,
  "paymentMethod": "CARD",
  "cardNumber": "1234567890123456",
  "cardType": "CREDIT",
  "bankName": "HDFC Bank",
  "cardHolderName": "John Doe"
}
```

**Request Body (Cash Payment):**

```json
{
  "userId": 1,
  "pickupLocation": "Times Square",
  "dropLocation": "Central Park",
  "distance": 5.0,
  "ecoRide": false,
  "paymentMethod": "CASH",
  "receivedAmount": 100.0,
  "collectedBy": "Rajesh Kumar"
}
```

**Success Response (201):**

```json
{
  "bookingId": 1,
  "userId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "pickupLocation": "Times Square",
  "dropLocation": "Central Park",
  "distance": 5.0,
  "fare": 63.0,
  "status": "CONFIRMED",
  "bookingTime": "2025-10-04T10:30:00",
  "ecoRide": false,
  "carbonSaved": 0.0,
  "cabId": 1,
  "cabNumber": "DL-01-AB-1234",
  "cabType": "Sedan",
  "isElectric": true,
  "driverId": 1,
  "driverName": "Rajesh Kumar",
  "driverPhone": "9988776655",
  "driverRating": 4.5,
  "paymentMethod": "UPI",
  "paymentStatus": "PENDING",
  "message": "Booking created successfully!"
}
```

---

### 2. Create Eco-Friendly Booking

**Endpoint:** `POST /api/bookings/eco`

**Request Body:**

```json
{
  "userId": 1,
  "pickupLocation": "Brooklyn Bridge",
  "dropLocation": "Statue of Liberty",
  "distance": 8.0,
  "paymentMethod": "UPI",
  "upiId": "john@paytm"
}
```

**Success Response (201):**

```json
{
  "bookingId": 2,
  "userId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "pickupLocation": "Brooklyn Bridge",
  "dropLocation": "Statue of Liberty",
  "distance": 8.0,
  "fare": 100.8,
  "status": "CONFIRMED",
  "bookingTime": "2025-10-04T11:00:00",
  "ecoRide": true,
  "carbonSaved": 0.8,
  "cabId": 1,
  "cabNumber": "DL-01-AB-1234",
  "cabType": "Sedan",
  "isElectric": true,
  "driverId": 1,
  "driverName": "Rajesh Kumar",
  "driverPhone": "9988776655",
  "driverRating": 4.5,
  "paymentMethod": "UPI",
  "paymentStatus": "PENDING",
  "message": "Booking created successfully!"
}
```

**Note:**

- `ecoRide` is automatically set to `true`
- `carbonSaved` = distance × 0.10 kg CO2
- Prioritizes electric vehicles

---

### 3. Get User Bookings

**Endpoint:** `GET /api/bookings/user/{userId}`

**Example:** `GET /api/bookings/user/1`

**Response (200):**

```json
[
  {
    "bookingId": 1,
    "userId": 1,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "pickupLocation": "Times Square",
    "dropLocation": "Central Park",
    "distance": 5.0,
    "fare": 63.0,
    "status": "CONFIRMED",
    "bookingTime": "2025-10-04T10:30:00",
    "ecoRide": false,
    "carbonSaved": 0.0,
    "cabId": 1,
    "cabNumber": "DL-01-AB-1234",
    "cabType": "Sedan",
    "isElectric": true,
    "driverId": 1,
    "driverName": "Rajesh Kumar",
    "driverPhone": "9988776655",
    "driverRating": 4.5,
    "paymentMethod": "UPI",
    "paymentStatus": "SUCCESS"
  }
]
```

---

### 4. Get All Bookings

**Endpoint:** `GET /api/bookings`

**Response (200):**

```json
[
  {
    "bookingId": 1,
    "userId": 1,
    "userName": "John Doe",
    ...
  },
  {
    "bookingId": 2,
    "userId": 2,
    "userName": "Jane Smith",
    ...
  }
]
```

---

### 5. Health Check

**Endpoint:** `GET /api/bookings/health`

**Response (200):**

```
Booking API is running!
```

---

## 👤 User APIs

### 1. Get All Users

**Endpoint:** `GET /api/users`

**Response (200):**

```json
[
  {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, New York",
    "password": "***"
  },
  {
    "userId": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543211",
    "address": "456 Park Ave, Los Angeles",
    "password": "***"
  }
]
```

---

### 2. Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Example:** `GET /api/users/1`

**Response (200):**

```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, New York",
  "password": "***"
}
```

---

### 3. Create User

**Endpoint:** `POST /api/users`

**Request Body:**

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "phone": "1234567890",
  "address": "New Address",
  "password": "newpassword123"
}
```

**Response (201):**

```json
{
  "userId": 4,
  "name": "New User",
  "email": "newuser@example.com",
  "phone": "1234567890",
  "address": "New Address",
  "password": "***"
}
```

---

### 4. Update User

**Endpoint:** `PUT /api/users/{id}`

**Request Body:**

```json
{
  "name": "Updated Name",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "Updated Address",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "userId": 1,
  "name": "Updated Name",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "Updated Address",
  "password": "***"
}
```

---

### 5. Delete User

**Endpoint:** `DELETE /api/users/{id}`

**Response (204):** No content

---

## 🚗 Cab APIs

### 1. Get All Cabs

**Endpoint:** `GET /api/cabs`

**Response (200):**

```json
[
  {
    "cabId": 1,
    "cabNumber": "DL-01-AB-1234",
    "cabType": "Sedan",
    "ratePerKm": 12.0,
    "isElectric": true,
    "seats": 4,
    "isAvailable": true,
    "driver": {
      "driverId": 1,
      "name": "Rajesh Kumar",
      "licenseNumber": "DL1234567",
      "phone": "9988776655",
      "rating": 4.5,
      "available": true,
      "email": "rajesh@driver.com",
      "password": "***"
    }
  }
]
```

---

### 2. Get Available Cabs

**Endpoint:** `GET /api/cabs/available`

**Response (200):**

```json
[
  {
    "cabId": 1,
    "cabNumber": "DL-01-AB-1234",
    "cabType": "Sedan",
    "ratePerKm": 12.0,
    "isElectric": true,
    "seats": 4,
    "isAvailable": true,
    "driver": { ... }
  }
]
```

---

### 3. Get Eco-Friendly Cabs

**Endpoint:** `GET /api/cabs/eco`

**Response (200):**

```json
[
  {
    "cabId": 1,
    "cabNumber": "DL-01-AB-1234",
    "cabType": "Sedan",
    "ratePerKm": 12.0,
    "isElectric": true,
    "seats": 4,
    "isAvailable": true,
    "driver": { ... }
  }
]
```

---

### 4. Get Cab by ID

**Endpoint:** `GET /api/cabs/{id}`

**Example:** `GET /api/cabs/1`

**Response (200):**

```json
{
  "cabId": 1,
  "cabNumber": "DL-01-AB-1234",
  "cabType": "Sedan",
  "ratePerKm": 12.0,
  "isElectric": true,
  "seats": 4,
  "isAvailable": true,
  "driver": { ... }
}
```

---

### 5. Get Cabs by Type

**Endpoint:** `GET /api/cabs/type/{type}`

**Example:** `GET /api/cabs/type/Sedan`

**Response (200):**

```json
[
  {
    "cabId": 1,
    "cabNumber": "DL-01-AB-1234",
    "cabType": "Sedan",
    ...
  }
]
```

---

### 6. Update Cab Availability

**Endpoint:** `PATCH /api/cabs/{id}/availability?available={true|false}`

**Example:** `PATCH /api/cabs/1/availability?available=false`

**Response (200):**

```json
{
  "cabId": 1,
  "cabNumber": "DL-01-AB-1234",
  "cabType": "Sedan",
  "ratePerKm": 12.0,
  "isElectric": true,
  "seats": 4,
  "isAvailable": false,
  "driver": { ... }
}
```

---

## 📊 Response Status Codes

| Code | Status                | Description                   |
| ---- | --------------------- | ----------------------------- |
| 200  | OK                    | Request successful            |
| 201  | Created               | Resource created successfully |
| 204  | No Content            | Deletion successful           |
| 400  | Bad Request           | Invalid request data          |
| 401  | Unauthorized          | Invalid credentials           |
| 404  | Not Found             | Resource not found            |
| 500  | Internal Server Error | Server error                  |

---

## 🔄 Payment Processing

Payment processing happens **asynchronously** using multithreading (CompletableFuture).

### Payment Flow:

1. Booking is created with `paymentStatus: "PENDING"`
2. Payment is processed in a background thread
3. After ~1 second, payment status updates to `"SUCCESS"` or `"FAILED"`
4. Check booking details again to see updated payment status

### Payment Types Supported:

| Type     | Fields Required                                        |
| -------- | ------------------------------------------------------ |
| **UPI**  | `upiId`                                                |
| **CARD** | `cardNumber`, `cardType`, `bankName`, `cardHolderName` |
| **CASH** | `receivedAmount`, `collectedBy`                        |

---

## 💾 File I/O

All bookings are automatically logged to: `logs/booking-logs.txt`

**Log Format:**

```
[2025-10-04 10:30:00] Booking #1 | User: John Doe | From: Times Square | To: Central Park | Distance: 5.00 km | Fare: ₹63.00 | Cab: DL-01-AB-1234 | EcoRide: NO | Carbon Saved: 0.00 kg
```

---

## 🧪 Testing with cURL

### Register and Login

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","phone":"1234567890","address":"Test","password":"test123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Booking

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"pickupLocation":"A","dropLocation":"B","distance":5,"ecoRide":true,"paymentMethod":"UPI","upiId":"john@paytm"}'
```

### Get Bookings

```bash
curl http://localhost:8080/api/bookings/user/1
```

---

## 📝 Postman Collection

Import this URL in Postman:

```
https://www.getpostman.com/collections/cab-booking-system-api
```

Or manually create requests using the endpoints above.

---

## 🎯 OOP Concepts in API

| Concept            | Implementation                               |
| ------------------ | -------------------------------------------- |
| **Encapsulation**  | Entity classes with private fields           |
| **Inheritance**    | Payment class hierarchy (UPI, Card, Cash)    |
| **Polymorphism**   | Different `processPayment()` implementations |
| **Abstraction**    | Payment abstract class, Payable interface    |
| **Composition**    | Booking has-a User, Cab, Driver              |
| **Collections**    | HashMap for cabs, ArrayList for bookings     |
| **Multithreading** | Async payment processing                     |
| **File I/O**       | Booking logs to file                         |

---

**API Version:** 1.0.0  
**Last Updated:** October 4, 2025
