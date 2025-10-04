# 🚕 Cab Booking System

A full-stack web application demonstrating **Object-Oriented Programming (OOP)** concepts using **Next.js**, **Spring Boot**, and **PostgreSQL**.

## 🎯 Project Overview

This project is a comprehensive cab booking system with an eco-friendly mode that prioritizes electric vehicles and calculates carbon savings.

### ✨ Key Features

- **🗺️ OpenStreetMap Integration**: 100% FREE mapping with no API keys required
- **📍 Smart Location Search**: Type-ahead address suggestions using Nominatim API
- **🛣️ Visual Route Display**: Interactive Leaflet map showing pickup, drop, and optimal route
- **📏 Auto Distance Calculation**: Precise driving distance via OSRM (Open Source Routing Machine)
- **💰 Zero Mapping Costs**: No Google Maps API key or billing setup needed
- **Book Rides**: Normal and eco-friendly ride booking
- **Multiple Payment Methods**: UPI, Card, and Cash (demonstrating **Polymorphism**)
- **Eco-Friendly Mode**: Prioritize electric vehicles or carpools
- **Carbon Savings Calculation**: Track environmental impact
- **Booking History**: View all past bookings
- **Real-time Cab Assignment**: Smart driver allocation
- **🔐 Admin Panel**: Complete dashboard for managing users, drivers, cabs, and bookings

## 🏗️ Architecture & OOP Concepts

### 1. **Encapsulation**

- Private fields with getters/setters in entities (`User`, `Driver`, `Cab`)
- Data hiding using Lombok annotations

### 2. **Inheritance**

- `Payment` (abstract class) → `UPIPayment`, `CardPayment`, `CashPayment`
- Single Table Inheritance strategy in JPA

### 3. **Polymorphism**

- `processPayment()` method works differently for each payment type
- Runtime polymorphism through method overriding

### 4. **Abstraction**

- Abstract `Payment` class with abstract `processPayment()` method
- `Payable` interface defining contract for payment processing

### 5. **Composition**

- `Booking` **has-a** `User`, `Cab`, and `Driver`
- Object relationships through JPA associations

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** (React Framework)
- **TypeScript**
- **TailwindCSS** (Styling)
- **React-Leaflet** (OpenStreetMap integration)
- **Leaflet** (Interactive maps library)
- **Nominatim API** (Free geocoding & address search)
- **OSRM** (Free route calculation)
- **Axios** (HTTP Client)

### Backend

- **Spring Boot 3.3.4** (Java Framework)
- **Spring Data JPA** (ORM)
- **PostgreSQL** (Database)
- **MySQL** (Database)
- **Lombok** (Boilerplate Reduction)

### Additional Features

- **Collections**: ArrayList, HashMap for caching
- **Multithreading**: Asynchronous payment processing
- **File Logging**: Booking logs written to file

## 📁 Project Structure

```
cab-booking-system/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/cabsystem/
│   │   ├── entity/                   # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Driver.java
│   │   │   ├── Cab.java
│   │   │   ├── Booking.java
│   │   │   ├── Payment.java         # Abstract class
│   │   │   ├── UPIPayment.java
│   │   │   ├── CardPayment.java
│   │   │   └── CashPayment.java
│   │   ├── repository/               # JPA Repositories
│   │   ├── service/                  # Business Logic
│   │   ├── controller/               # REST Controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── interfaces/               # Interfaces (Payable)
│   │   └── config/                   # Configuration
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── schema.sql
│   └── pom.xml
│
├── frontend/                         # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx                  # Landing Page
│   │   ├── book-ride/page.tsx        # Booking Form
│   │   ├── booking-summary/page.tsx  # Confirmation Page
│   │   ├── my-bookings/page.tsx      # Booking History
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md
```

## 🗄️ Database Schema

### Tables

1. **users** - User information
2. **drivers** - Driver details
3. **cabs** - Cab details with driver association
4. **bookings** - Ride bookings with user, cab, and driver references
5. **payments** - Payment records (Single Table Inheritance)

## 🚀 Setup & Installation

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Maven 3.6+**

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE cab_booking_system;

-- MySQL will auto-create tables via Spring Boot JPA
```

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cab_booking_system
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on **http://localhost:3000**

## 📡 API Endpoints

### Bookings

- `POST /api/bookings` - Create normal booking
- `POST /api/bookings/eco` - Create eco-friendly booking
- `GET /api/bookings/{userId}` - Get user booking history

### Users

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user

### Cabs

- `GET /api/cabs` - Get all cabs
- `GET /api/cabs/available` - Get available cabs
- `GET /api/cabs/eco` - Get eco-friendly cabs

## 🌱 Eco-Friendly Feature

### How it works:

1. User selects "Eco-Friendly Ride" checkbox
2. System prioritizes:
   - **Electric Vehicles** (is_electric = true)
   - Falls back to **Carpools** (seats > 1)
3. Carbon savings calculated:
   - Normal Car: 0.12 kg CO₂/km
   - EV: 0.02 kg CO₂/km
   - **Formula**: `(distance × 0.10)`
4. Display carbon saved on confirmation page

## 💳 Payment Methods (Polymorphism Demo)

### UPI Payment

```java
public class UPIPayment extends Payment {
    @Override
    public String processPayment() {
        // UPI-specific processing
    }
}
```

### Card Payment

```java
public class CardPayment extends Payment {
    @Override
    public String processPayment() {
        // Card-specific processing
    }
}
```

### Cash Payment

```java
public class CashPayment extends Payment {
    @Override
    public String processPayment() {
        // Cash-specific processing
    }
}
```

## 📊 OOP Concepts Demonstration

### Encapsulation Example

```java
@Entity
public class User {
    @Id
    private Long userId;  // Private field

    private String name;  // Private field

    // Getters and setters (via Lombok @Data)
}
```

### Inheritance Example

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class Payment {
    public abstract String processPayment();
}

@Entity
public class UPIPayment extends Payment {
    @Override
    public String processPayment() {
        // Implementation
    }
}
```

### Polymorphism Example

```java
Payment payment = createPayment(request);  // Can be UPI, Card, or Cash
String result = payment.processPayment();  // Different behavior based on type
```

### Composition Example

```java
@Entity
public class Booking {
    @ManyToOne
    private User user;     // Has-a relationship

    @ManyToOne
    private Cab cab;       // Has-a relationship

    @ManyToOne
    private Driver driver; // Has-a relationship
}
```

## 🎨 Frontend Features

### Landing Page

- Hero section with feature cards
- CTA buttons for booking and viewing history
- Statistics display

### Book Ride Page

- Form with pickup, drop, distance inputs
- Eco-friendly ride toggle
- Payment method selection
- Dynamic payment fields based on method

### Booking Summary Page

- Complete booking details
- Cab and driver information
- Payment status
- Carbon savings display (for eco-rides)

### My Bookings Page

- List of all bookings
- Filter by user
- Booking statistics
- Carbon savings summary

## 📝 Sample Data

The application includes seed data:

- **3 Users**: John Doe, Jane Smith, Mike Johnson
- **5 Drivers**: Various drivers with ratings
- **5 Cabs**: 3 Electric, 2 Regular

## 🧪 Testing

### Test Normal Booking

1. Go to "Book a Ride"
2. Enter pickup/drop locations
3. Enter distance (e.g., 10 km)
4. Select payment method
5. Submit booking

### Test Eco-Friendly Booking

1. Same as above
2. Check "Book Eco-Friendly Ride"
3. System will assign an EV or carpool
4. View carbon savings on confirmation

## 📈 Advanced Features

### Collections Usage

- `HashMap<Long, Cab>` for caching available cabs
- `ArrayList<Booking>` for recent bookings cache

### Multithreading

- Asynchronous payment processing using `CompletableFuture`
- Simulates concurrent booking requests

### File Logging

- Booking details logged to `logs/booking-logs.txt`
- Includes timestamp, user, cab, fare, and carbon savings

## �️ OpenStreetMap Integration

### 100% FREE Mapping Solution

This system uses **OpenStreetMap** instead of Google Maps, providing:

- ✅ **No API Keys Required** - Zero setup time
- ✅ **No Billing Information** - Completely free forever
- ✅ **No Usage Limits** - Fair use policy only
- ✅ **Open Source** - Community-driven data

### Features

1. **Location Search** - Nominatim API for address autocomplete
2. **Route Calculation** - OSRM for driving directions and distance
3. **Interactive Map** - Leaflet with custom markers and route display
4. **Smart Suggestions** - Type 3+ characters to get location suggestions

### Quick Start

```bash
# No Google Maps API key needed!
# Just start the application:

cd frontend
npm run dev

# Visit http://localhost:3000/book-ride
# Start typing locations - it just works! 🎉
```

### Documentation

- See [OPENSTREETMAP_QUICK_START.md](OPENSTREETMAP_QUICK_START.md) for detailed guide
- See [OPENSTREETMAP_MIGRATION_COMPLETE.md](OPENSTREETMAP_MIGRATION_COMPLETE.md) for migration details

---

## �🔧 Configuration

### Backend Port

Default: `8080`
Change in `application.properties`:

```properties
server.port=8080
```

### Frontend Port

Default: `3000`
Change in `package.json` scripts or use:

```bash
npm run dev -- -p 3001
```

### CORS

Configured to allow `http://localhost:3000`
Update in `CorsConfig.java` if needed

## 🐛 Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database `cab_booking_system` exists

### Port Already in Use

- Kill process on port 8080 (backend) or 3000 (frontend)
- Or change ports in configuration

### No Cabs Available

- Check database has seed data
- Verify cabs have `is_available = true`
- Run `DataInitializer` to populate data

## 📚 Learning Outcomes

This project demonstrates:

1. ✅ **Encapsulation** - Private fields with controlled access
2. ✅ **Inheritance** - Payment hierarchy
3. ✅ **Polymorphism** - Different payment processing
4. ✅ **Abstraction** - Abstract classes and interfaces
5. ✅ **Composition** - Object relationships
6. ✅ **Collections** - HashMap, ArrayList usage
7. ✅ **Multithreading** - Async operations
8. ✅ **File I/O** - Logging to files
9. ✅ **REST APIs** - CRUD operations
10. ✅ **Full-stack development** - Frontend + Backend integration

## 👨‍💻 Author

Built as a demonstration of OOP concepts in a real-world application.

## 📄 License

This project is for educational purposes.

---

**🚕 Happy Booking! Save the Planet with Eco-Rides! 🌱**
