# 🚀 Backend Setup Guide

## Prerequisites

Before setting up the backend, ensure you have the following installed:

- ✅ **Java 17 or higher** ([Download](https://www.oracle.com/java/technologies/downloads/))
- ✅ **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- ✅ **MySQL 8.0+** ([Download](https://dev.mysql.com/downloads/mysql/))
- ✅ **Git** ([Download](https://git-scm.com/downloads))

### Verify Installation

```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check MySQL version
mysql --version
```

---

## 📦 Database Setup

### Step 1: Start MySQL Server

**Windows:**

```bash
# Start MySQL service
net start MySQL80
```

**macOS/Linux:**

```bash
# Start MySQL service
sudo systemctl start mysql
# OR
sudo service mysql start
```

### Step 2: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE cab_booking_db;

# Exit MySQL
exit;
```

**Note:** The application will automatically create tables using JPA when it starts.

### Step 3: Configure Database Credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_password_here
```

Replace `your_password_here` with your MySQL root password.

---

## 🏗️ Backend Installation

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
# Clean and install Maven dependencies
mvn clean install
```

This will:

- Download all required dependencies
- Compile the Java code
- Run tests
- Create executable JAR file

### Step 3: Run the Application

**Option 1: Using Maven**

```bash
mvn spring-boot:run
```

**Option 2: Using Java**

```bash
# Build JAR file
mvn clean package

# Run JAR file
java -jar target/cab-booking-system-1.0.0.jar
```

### Step 4: Verify Backend is Running

Open your browser and visit:

- **Health Check:** http://localhost:8080/api/auth/check
- **All Users:** http://localhost:8080/api/users
- **All Cabs:** http://localhost:8080/api/cabs

You should see JSON responses.

---

## 🌱 Seed Data

The application automatically seeds the database with initial data on first run:

### Users (3)

| Name         | Email            | Password    |
| ------------ | ---------------- | ----------- |
| John Doe     | john@example.com | password123 |
| Jane Smith   | jane@example.com | password123 |
| Mike Johnson | mike@example.com | password123 |

### Drivers (5)

| Name         | License   | Email             | Password  |
| ------------ | --------- | ----------------- | --------- |
| Rajesh Kumar | DL1234567 | rajesh@driver.com | driver123 |
| Amit Sharma  | DL2345678 | amit@driver.com   | driver123 |
| Suresh Patel | DL3456789 | suresh@driver.com | driver123 |
| Vikram Singh | DL4567890 | vikram@driver.com | driver123 |
| Ravi Verma   | DL5678901 | ravi@driver.com   | driver123 |

### Cabs (5)

- **3 Electric Vehicles** (Eco-friendly)
- **2 Regular Vehicles**

---

## 🔧 Configuration

### Port Configuration

Default port: **8080**

To change the port, edit `application.properties`:

```properties
server.port=8081
```

### Database Configuration

```properties
# Database URL
spring.datasource.url=jdbc:mysql://localhost:3306/cab_booking_db

# Database credentials
spring.datasource.username=root
spring.datasource.password=root

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### CORS Configuration

The backend allows requests from:

- http://localhost:3000 (Next.js default)
- http://localhost:3001
- All origins (for development)

Edit `CorsConfig.java` to customize.

---

## 📝 Testing the Backend

### Using cURL

**Register a new user:**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "address": "Test Address",
    "password": "test123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create a booking:**

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "pickupLocation": "Times Square",
    "dropLocation": "Central Park",
    "distance": 5.0,
    "ecoRide": true,
    "paymentMethod": "UPI",
    "upiId": "john@paytm"
  }'
```

### Using Postman

1. Import the API collection (see API_DOCUMENTATION.md)
2. Set base URL: `http://localhost:8080/api`
3. Test all endpoints

---

## 🐛 Troubleshooting

### Issue: Port 8080 already in use

**Solution:**

```bash
# Windows - Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:8080 | xargs kill -9
```

### Issue: Database connection failed

**Solution:**

1. Verify MySQL is running
2. Check username/password in `application.properties`
3. Ensure database `cab_booking_db` exists

### Issue: Maven dependencies not downloading

**Solution:**

```bash
# Clear Maven cache
mvn dependency:purge-local-repository

# Re-install
mvn clean install -U
```

### Issue: Lombok not working

**Solution:**

1. Install Lombok plugin in your IDE
2. Enable annotation processing in IDE settings

---

## 🚀 Production Deployment

### Build for Production

```bash
# Create production-ready JAR
mvn clean package -DskipTests

# JAR file location
target/cab-booking-system-1.0.0.jar
```

### Run in Production

```bash
java -jar target/cab-booking-system-1.0.0.jar --spring.profiles.active=prod
```

### Environment Variables

Set these for production:

```bash
export DB_URL=jdbc:mysql://production-host:3306/cab_booking_db
export DB_USERNAME=prod_user
export DB_PASSWORD=prod_password
export SERVER_PORT=8080
```

---

## 📊 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/cabsystem/
│   │   │   ├── entity/           # JPA Entities (8 files)
│   │   │   ├── repository/       # Data Access Layer (5 files)
│   │   │   ├── service/          # Business Logic (2 files)
│   │   │   ├── controller/       # REST APIs (4 files)
│   │   │   ├── dto/              # Data Transfer Objects (6 files)
│   │   │   ├── config/           # Configuration (2 files)
│   │   │   ├── interfaces/       # Interfaces (1 file)
│   │   │   └── CabBookingSystemApplication.java
│   │   └── resources/
│   │       └── application.properties
├── pom.xml
└── README.md
```

---

## ✅ Next Steps

1. ✅ Backend is running on http://localhost:8080
2. 📱 Start the frontend (see frontend/README.md)
3. 🔗 Connect frontend to backend
4. 🧪 Test the complete application

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Maven Documentation](https://maven.apache.org/guides/)
- [API Documentation](./API_DOCUMENTATION.md)

---

## 🆘 Support

If you encounter any issues:

1. Check the logs: `logs/booking-logs.txt`
2. Review the console output
3. Verify all prerequisites are installed
4. Check the troubleshooting section above

**Happy Coding! 🚕**
