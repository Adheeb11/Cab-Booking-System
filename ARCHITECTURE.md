# 🏗️ System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                   (Next.js + TailwindCSS)                        │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │   Landing   │  │  Book Ride   │  │  Booking Summary     │   │
│  │    Page     │  │     Page     │  │       Page           │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              My Bookings Page                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (REST API)
                              │ Axios/Fetch
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                             │
│                   (Spring Boot REST)                             │
│                                                                   │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐          │
│  │   Booking    │  │    User     │  │     Cab      │          │
│  │  Controller  │  │ Controller  │  │  Controller  │          │
│  └──────────────┘  └─────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                │
│                   (Business Logic)                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              BookingService                              │   │
│  │  • createBooking()                                       │   │
│  │  • createEcoBooking()                                    │   │
│  │  • calculateFare()                                       │   │
│  │  • calculateCarbonSavings()                              │   │
│  │  • processPaymentAsync()                                 │   │
│  │  • logBookingToFile()                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Collections: HashMap<Long, Cab>, ArrayList<Booking>            │
│  Multithreading: CompletableFuture.runAsync()                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                               │
│                   (Data Access - JPA)                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    User      │  │   Driver     │  │     Cab      │         │
│  │  Repository  │  │  Repository  │  │  Repository  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Booking    │  │   Payment    │                            │
│  │  Repository  │  │  Repository  │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ENTITY LAYER                                │
│                    (Domain Models)                               │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   User   │  │  Driver  │  │   Cab    │  │ Booking  │       │
│  │  (JPA)   │  │  (JPA)   │  │  (JPA)   │  │  (JPA)   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐     │
│  │              Payment (Abstract)                        │     │
│  │                      │                                 │     │
│  │        ┌─────────────┼─────────────┐                  │     │
│  │        │             │             │                  │     │
│  │   UPIPayment   CardPayment   CashPayment             │     │
│  │   (Subclass)   (Subclass)    (Subclass)              │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                   │
│  OOP Concepts:                                                   │
│  ✅ Encapsulation (private fields)                              │
│  ✅ Inheritance (Payment hierarchy)                             │
│  ✅ Polymorphism (processPayment())                             │
│  ✅ Abstraction (abstract Payment class)                        │
│  ✅ Composition (Booking has User, Cab, Driver)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                        (MySQL 8.0)                               │
│                                                                   │
│  Tables:                                                         │
│  • users (3 records)                                             │
│  • drivers (5 records)                                           │
│  • cabs (5 records - 3 EVs, 2 regular)                          │
│  • bookings (dynamic)                                            │
│  • payments (Single Table Inheritance)                           │
│                                                                   │
│  Relationships:                                                  │
│  • Cab → Driver (Many-to-One)                                   │
│  • Booking → User, Cab, Driver (Many-to-One)                    │
│  • Payment → Booking (One-to-One)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FILE SYSTEM                                 │
│                                                                   │
│  logs/booking-logs.txt                                           │
│  • Timestamped booking records                                   │
│  • Carbon savings tracking                                       │
│  • Fare details                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Interactions

### 1. Normal Booking Flow

```
User (Frontend)
    │
    │ 1. Fill form & submit
    │
    ▼
BookingController
    │
    │ 2. POST /api/bookings
    │
    ▼
BookingService
    │
    ├─► 3. Validate user (UserRepository)
    │
    ├─► 4. Find available cab (CabRepository)
    │
    ├─► 5. Calculate fare
    │
    ├─► 6. Create booking (BookingRepository)
    │
    ├─► 7. Update cab availability
    │
    ├─► 8. Process payment async (new thread)
    │
    └─► 9. Log to file
    │
    ▼
Response to Frontend
    │
    ▼
Booking Summary Page
```

### 2. Eco-Friendly Booking Flow

```
User (Frontend)
    │
    │ 1. Check "Eco-Ride" & submit
    │
    ▼
BookingController
    │
    │ 2. POST /api/bookings/eco
    │
    ▼
BookingService
    │
    ├─► 3. Validate user
    │
    ├─► 4. Find EV cabs (priority)
    │   │
    │   └─► If no EVs, find carpools (fallback)
    │
    ├─► 5. Calculate fare
    │
    ├─► 6. Calculate carbon savings
    │   │   Formula: distance × 0.10
    │
    ├─► 7. Create booking with carbon data
    │
    ├─► 8. Process payment async
    │
    └─► 9. Log to file (ECO type)
    │
    ▼
Response with carbonSaved
    │
    ▼
Booking Summary (with eco badge)
```

### 3. Payment Processing (Polymorphism)

```
BookingService.createPayment()
    │
    │ Switch on paymentMethod
    │
    ├─► "UPI" → new UPIPayment()
    │             │
    │             └─► processPayment() [UPI implementation]
    │
    ├─► "CARD" → new CardPayment()
    │             │
    │             └─► processPayment() [Card implementation]
    │
    └─► "CASH" → new CashPayment()
                  │
                  └─► processPayment() [Cash implementation]
    │
    ▼
Payment saved to database
```

---

## OOP Concepts Architecture

### Inheritance Hierarchy

```
                Payment (Abstract)
                    │
        ┌───────────┼───────────┐
        │           │           │
   UPIPayment  CardPayment  CashPayment
        │           │           │
        └───────────┴───────────┘
                    │
            Single Table in DB
         (payment_type discriminator)
```

### Composition Relationship

```
        Booking
           │
    ┌──────┼──────┐
    │      │      │
   User   Cab  Driver
    │      │      │
    │      └──────┤
    │             │
    └─────────────┘
         │
    Database FKs
```

---

## Data Flow

### Request Flow (Frontend → Backend)

```
1. User Action (Button Click)
        ↓
2. React Event Handler
        ↓
3. Axios HTTP Request
        ↓
4. Spring Controller (@RestController)
        ↓
5. Service Layer (@Service)
        ↓
6. Repository Layer (@Repository)
        ↓
7. JPA/Hibernate
        ↓
8. MySQL Database
        ↓
9. Response Entity
        ↓
10. JSON Response
        ↓
11. Frontend State Update
        ↓
12. UI Re-render
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  Next.js, React, TypeScript, Tailwind   │
└─────────────────────────────────────────┘
                  ↕ HTTP/REST
┌─────────────────────────────────────────┐
│          API Layer                      │
│  Spring Boot REST Controllers           │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│        Business Logic Layer             │
│  Service Classes, Business Rules        │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│  Spring Data JPA Repositories           │
└─────────────────────────────────────────┘
                  ↕ JDBC
┌─────────────────────────────────────────┐
│         Persistence Layer               │
│  MySQL Database                         │
└─────────────────────────────────────────┘
```

---

## Security & Configuration

```
┌──────────────────────────┐
│   Frontend (Port 3000)   │
└──────────────────────────┘
            │
            │ CORS Enabled
            │
            ▼
┌──────────────────────────┐
│   Backend (Port 8080)    │
│                          │
│  CORS Configuration:     │
│  • Origin: localhost:3000│
│  • Methods: GET, POST    │
│  • Headers: *            │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│   MySQL (Port 3306)      │
│                          │
│  Credentials in:         │
│  application.properties  │
└──────────────────────────┘
```

---

## Async Operations

```
Main Thread (Booking)
    │
    ├─► Create Booking
    │   └─► Save to DB (synchronous)
    │
    ├─► Return Response to User (fast)
    │
    └─► Spawn Async Thread
            │
            └─► Payment Processing
                (CompletableFuture)
                    │
                    ├─► Wait 1 second
                    ├─► Create Payment object
                    ├─► Call processPayment()
                    └─► Save to DB

User sees confirmation immediately,
payment processes in background!
```

---

## Caching Strategy

```
BookingService
    │
    ├─► availableCabsCache (HashMap)
    │   │
    │   └─► Key: cabId (Long)
    │       Value: Cab object
    │       Purpose: O(1) lookup
    │
    └─► recentBookings (ArrayList)
        │
        └─► Stores last 100 bookings
            Purpose: Quick access to recent data
```

---

## File Logging Architecture

```
Booking Created
    │
    ▼
BookingService.logBookingToFile()
    │
    ├─► Open: logs/booking-logs.txt
    │   (append mode)
    │
    ├─► Format log entry:
    │   • Timestamp
    │   • Booking type (NORMAL/ECO)
    │   • Booking ID
    │   • User name
    │   • Fare
    │   • Carbon saved
    │
    └─► Write to file
        │
        └─► Close file (try-with-resources)
```

---

## Design Patterns Used

### 1. Repository Pattern
```
Controller → Service → Repository → Database
```

### 2. DTO Pattern
```
Entity ←→ DTO ←→ API
(Internal)  (Transfer)  (External)
```

### 3. Dependency Injection
```
@Service
public class BookingService {
    @Autowired
    private BookingRepository repo;
}
```

### 4. Template Method (Polymorphism)
```
Payment.processPayment() [abstract]
    │
    ├─► UPIPayment.processPayment() [concrete]
    ├─► CardPayment.processPayment() [concrete]
    └─► CashPayment.processPayment() [concrete]
```

---

## Scalability Considerations

### Current Architecture
- Single server deployment
- Synchronous API calls
- In-memory caching

### Future Enhancements
- Load balancer for multiple instances
- Redis for distributed caching
- Message queue for async processing
- Microservices architecture
- Docker containerization

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────┐
│         Cloud/Server                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Frontend (Vercel/Netlify)     │   │
│  │   Static Build                  │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│  ┌─────────────────────────────────┐   │
│  │   Backend (AWS/Heroku)          │   │
│  │   Spring Boot JAR               │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│  ┌─────────────────────────────────┐   │
│  │   Database (AWS RDS/MySQL)      │   │
│  │   Production DB                 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

**This architecture demonstrates a clean separation of concerns, following SOLID principles and best practices for full-stack application development.**
