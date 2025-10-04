# 🚀 Quick Start Guide

Follow these steps to get the Cab Booking System up and running quickly!

## Prerequisites Checklist

- [ ] Java 17 or higher installed
- [ ] Maven 3.6+ installed
- [ ] Node.js 18+ and npm installed
- [ ] MySQL 8.0+ installed and running

## Step-by-Step Instructions

### Step 1: Database Setup (5 minutes)

1. **Start MySQL Server**
   ```bash
   # Make sure MySQL is running
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE cab_booking_system;
   ```

3. **Update Database Credentials**
   
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### Step 2: Backend Setup (3 minutes)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Verify backend is running**
   - Open browser: http://localhost:8080/api/bookings
   - You should see: "Booking API is running! 🚕"

4. **Check logs**
   - Look for "🚕 Cab Booking System Backend Started Successfully!"
   - Seed data should be initialized automatically
   - Check: "✅ Created 3 users", "✅ Created 5 drivers", "✅ Created 5 cabs"

### Step 3: Frontend Setup (2 minutes)

1. **Open a new terminal** (keep backend running)

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   - Browser: http://localhost:3000
   - You should see the beautiful landing page! 🎉

## Testing the Application

### Test 1: Normal Booking
1. Click "🚀 Book a Ride Now"
2. Fill in the form:
   - Pickup: "Airport"
   - Drop: "Hotel"
   - Distance: "10"
   - Payment Method: "UPI"
   - UPI ID: "test@upi"
3. Click "Confirm Booking"
4. View booking summary with cab details

### Test 2: Eco-Friendly Booking
1. Click "🚀 Book a Ride Now"
2. Fill in the form
3. **Check "🌱 Book Eco-Friendly Ride"**
4. Complete booking
5. View carbon savings! 🌱

### Test 3: View Bookings
1. Click "📋 My Bookings"
2. See all your ride history
3. View carbon savings summary

## Port Information

- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:3000
- **MySQL**: localhost:3306

## API Test Endpoints

Test these in your browser or Postman:

```
GET http://localhost:8080/api/users
GET http://localhost:8080/api/cabs
GET http://localhost:8080/api/cabs/available
GET http://localhost:8080/api/cabs/eco
GET http://localhost:8080/api/bookings/1
```

## Troubleshooting

### Backend won't start
- ✅ Check MySQL is running
- ✅ Verify database credentials
- ✅ Ensure port 8080 is not in use
- ✅ Check Java version: `java -version`

### Frontend won't start
- ✅ Run `npm install` again
- ✅ Delete `node_modules` and reinstall
- ✅ Check port 3000 is available

### "No cabs available" error
- ✅ Check backend logs for seed data initialization
- ✅ Query database: `SELECT * FROM cabs;`
- ✅ Restart backend to re-run DataInitializer

### Database connection error
```
Error: Access denied for user
```
- ✅ Update username/password in `application.properties`
- ✅ Ensure MySQL user has proper permissions

### CORS errors in browser
- ✅ Verify backend is running on port 8080
- ✅ Check CORS configuration in `CorsConfig.java`

## Default Test Users

The system comes with 3 pre-configured users:

| User ID | Name | Email |
|---------|------|-------|
| 1 | John Doe | john@example.com |
| 2 | Jane Smith | jane@example.com |
| 3 | Mike Johnson | mike@example.com |

## Stopping the Application

### Stop Backend
- Press `Ctrl + C` in backend terminal

### Stop Frontend
- Press `Ctrl + C` in frontend terminal

### Stop MySQL
- Depends on your OS and installation

## Next Steps

1. ✅ Test all features
2. ✅ Book multiple rides
3. ✅ Try eco-friendly bookings
4. ✅ Check the logs folder for booking logs
5. ✅ Explore the code to understand OOP concepts

## Need Help?

- Check `README.md` for detailed documentation
- Review the code comments
- Check backend logs: `logs/booking-logs.txt`

---

**🎉 Congratulations! Your Cab Booking System is ready!**

Start booking rides and save the planet! 🚕🌱
