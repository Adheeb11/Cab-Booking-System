# Admin Panel Guide

## 🔐 Admin Panel Access

Your Cab Booking System now includes a full-featured admin panel for managing all system data.

### Admin Login Credentials

```
Email:    admin@cabsystem.com
Password: admin123
```

### Admin Panel URL

```
http://localhost:3000/admin/login
```

---

## 📊 Admin Panel Features

### 1. Dashboard (`/admin/dashboard`)

- **Real-time Statistics**:

  - Total Users, Drivers, Cabs, Bookings
  - Total Revenue breakdown
  - Active/Completed bookings count
  - Eco-friendly bookings tracking
  - Total carbon saved

- **Quick Action Cards**:
  - Navigate to user management
  - View all bookings
  - Manage cab fleet

### 2. User Management (`/admin/users`)

- View all registered users
- Search by name, email, or phone
- See user roles (USER/ADMIN)
- Delete users (except admins)
- User details: ID, name, email, phone, address, role

### 3. Driver Management (`/admin/drivers`)

- View all drivers
- Driver details: ID, name, phone, license, experience, rating
- Delete drivers
- Sort and filter drivers

### 4. Cab Fleet Management (`/admin/cabs`)

- View all cabs in grid layout
- See cab details: number, type, seats, rate
- Electric vehicle (EV) badges
- Driver assignment info
- Toggle cab availability (Available/Busy)
- Delete cabs from fleet
- Visual status indicators

### 5. Booking Management (`/admin/bookings`)

- View all bookings with complete details
- Filter by status: ALL, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
- **Booking Information**:

  - User, Driver, and Cab details
  - Pickup and drop locations
  - Distance and fare
  - Booking date and time
  - Eco-friendly badges
  - Carbon savings (for eco rides)

- **Booking Actions**:
  - Start booking (change to IN_PROGRESS)
  - Complete booking
  - Cancel booking

### 6. Payment Management (`/admin/payments`)

- View all payment transactions
- Revenue analytics by payment method:

  - UPI revenue
  - Card revenue
  - Cash revenue
  - Total revenue

- **Payment Details**:
  - Payment ID and booking reference
  - User and route information
  - Amount and payment method
  - Payment status (SUCCESS/PENDING/FAILED)
  - Transaction date

---

## 🚀 Quick Start

### Step 1: Ensure Backend is Running

```powershell
cd C:\projects\Oops\Cab-Booking-System\backend
java -jar target\cab-booking-system-1.0.0.jar
```

Backend should start on **http://localhost:8080**

### Step 2: Start Frontend

```powershell
cd C:\projects\Oops\Cab-Booking-System\frontend
npm run dev
```

Frontend should start on **http://localhost:3000**

### Step 3: Access Admin Panel

1. Open browser and go to: **http://localhost:3000/admin/login**
2. Enter credentials:
   - Email: `admin@cabsystem.com`
   - Password: `admin123`
3. Click "Login to Admin Panel"
4. You'll be redirected to the admin dashboard

---

## 🎯 Admin Panel Navigation

The admin panel includes a top navigation bar with these tabs:

- **Dashboard** - Overview and statistics
- **Users** - User management
- **Drivers** - Driver management
- **Cabs** - Cab fleet management
- **Bookings** - Booking operations
- **Payments** - Payment tracking

---

## 🔧 Admin API Endpoints

All admin endpoints are protected and available at `/api/admin`:

### Dashboard Statistics

```
GET /api/admin/stats
```

Returns:

- Total users, drivers, cabs, bookings
- Total revenue
- Active/completed bookings
- Eco bookings count
- Total carbon saved

### User Management

```
GET    /api/admin/users          - Get all users
DELETE /api/admin/users/{id}     - Delete user
```

### Driver Management

```
GET    /api/admin/drivers        - Get all drivers
DELETE /api/admin/drivers/{id}   - Delete driver
```

### Cab Management

```
GET    /api/admin/cabs                        - Get all cabs
PUT    /api/admin/cabs/{id}/availability      - Toggle availability
DELETE /api/admin/cabs/{id}                   - Delete cab
```

### Booking Management

```
GET    /api/admin/bookings                 - Get all bookings
PUT    /api/admin/bookings/{id}/status     - Update booking status
```

### Payment Management

```
GET    /api/admin/payments              - Get all payments
GET    /api/admin/revenue/by-method     - Revenue breakdown by payment method
```

---

## 💡 Usage Examples

### View Dashboard Statistics

1. Login to admin panel
2. Dashboard loads automatically
3. See real-time stats for:
   - 4 users (including admin)
   - 5 drivers
   - 5 cabs
   - All bookings and revenue

### Manage a Booking

1. Navigate to **Bookings** tab
2. Filter by status (e.g., "CONFIRMED")
3. Click action buttons:
   - **Start** - Move to IN_PROGRESS
   - **Complete** - Mark as COMPLETED
   - **Cancel** - Cancel the booking

### Toggle Cab Availability

1. Navigate to **Cabs** tab
2. Find the cab you want to update
3. Click **Mark Busy** or **Mark Available**
4. Status updates immediately

### Delete a User

1. Navigate to **Users** tab
2. Search for the user (optional)
3. Click **Delete** button
4. Confirm deletion
5. User is removed from database

### View Payment Revenue

1. Navigate to **Payments** tab
2. See revenue cards at the top:
   - Total Revenue
   - UPI Revenue
   - Card Revenue
   - Cash Revenue
3. Scroll down to see all transactions

---

## 🎨 Admin Panel Design

- **Modern UI** with gradient headers
- **Responsive design** works on all screen sizes
- **Color-coded badges**:

  - Blue - Users
  - Purple - Drivers
  - Green - Cabs/Success
  - Yellow - Pending
  - Red - Admin/Errors
  - Emerald - Eco-friendly

- **Interactive elements**:
  - Hover effects on cards
  - Loading states
  - Success/error messages
  - Confirmation dialogs

---

## 🔒 Security Features

- **Role-based access**: Only users with ADMIN role can access
- **Client-side validation**: Email and password required
- **Server-side authentication**: Backend validates credentials
- **Protected routes**: Non-admins are denied access
- **Session management**: Admin info stored in localStorage

---

## 🐛 Troubleshooting

### Cannot Login to Admin Panel

**Problem**: "Access denied. Admin privileges required."

**Solutions**:

1. Verify you're using admin credentials:

   - Email: `admin@cabsystem.com`
   - Password: `admin123`

2. Check if admin user exists in database:

   ```powershell
   # Connect to PostgreSQL
   docker exec -it cab_booking_postgres psql -U postgres -d cab_booking_db

   # Query users table
   SELECT * FROM users WHERE role = 'ADMIN';
   ```

3. If admin doesn't exist, restart backend to re-seed database

### Backend Connection Error

**Problem**: "Connection error. Please ensure backend is running."

**Solutions**:

1. Check if backend is running on port 8080:

   ```powershell
   netstat -ano | findstr :8080
   ```

2. Start backend if not running:

   ```powershell
   cd C:\projects\Oops\Cab-Booking-System\backend
   java -jar target\cab-booking-system-1.0.0.jar
   ```

3. Check PostgreSQL is running:
   ```powershell
   docker-compose ps
   ```

### Data Not Loading

**Problem**: Tables show "No [items] found"

**Solutions**:

1. Ensure seed data was loaded (check backend logs)
2. Verify database connection
3. Check browser console for errors (F12)
4. Test API endpoint directly:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8080/api/admin/stats"
   ```

### Role Column Missing

**Problem**: Database error about missing 'role' column

**Solutions**:

1. **Option 1**: Drop and recreate database:

   ```powershell
   docker exec -it cab_booking_postgres psql -U postgres -d cab_booking_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
   ```

   Then restart backend to recreate tables

2. **Option 2**: Add role column manually:
   ```powershell
   docker exec -it cab_booking_postgres psql -U postgres -d cab_booking_db -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER';"
   docker exec -it cab_booking_postgres psql -U postgres -d cab_booking_db -c "UPDATE users SET role = 'ADMIN' WHERE email = 'admin@cabsystem.com';"
   ```

---

## 📝 Admin User Details

The system seeds one admin account automatically:

```
Name:    Admin User
Email:   admin@cabsystem.com
Phone:   9999999999
Address: Admin Office, Cab System HQ
Role:    ADMIN
Password: admin123 (hashed in database)
```

---

## 🌟 Key Features Summary

✅ **Complete CRUD Operations** - View, create, update, delete all entities
✅ **Real-time Dashboard** - Live statistics and metrics
✅ **Search & Filter** - Find users, filter bookings
✅ **Responsive Design** - Works on desktop, tablet, mobile
✅ **Role-Based Access** - Secure admin-only access
✅ **Database Connected** - All data from PostgreSQL
✅ **RESTful APIs** - Clean backend endpoints
✅ **Modern UI/UX** - Beautiful gradients and animations

---

## 🎓 Additional Admin Capabilities

### Future Enhancements (Not Yet Implemented)

Consider adding these features:

1. **User Editing** - Update user details
2. **Driver Adding** - Add new drivers through UI
3. **Cab Adding** - Add new cabs through UI
4. **Analytics Charts** - Visual graphs for revenue/bookings
5. **Date Range Filters** - Filter by date range
6. **Export Data** - Download CSV/PDF reports
7. **Bulk Operations** - Delete/update multiple items
8. **Audit Logs** - Track all admin actions
9. **Email Notifications** - Send emails to users
10. **Real-time Updates** - WebSocket for live data

---

## 📞 Support

If you encounter issues:

1. Check backend logs for errors
2. Check browser console (F12) for frontend errors
3. Verify all services are running (PostgreSQL, Backend, Frontend)
4. Review this guide for troubleshooting steps

---

**Your admin panel is ready to use! 🎉**

Access it at: **http://localhost:3000/admin/login**
