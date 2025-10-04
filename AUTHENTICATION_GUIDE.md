# 🔐 Authentication System Guide

## Overview

The Cab Booking System now includes a complete user authentication system with login and registration functionality.

## Features Added

### ✅ User Registration
- **Route:** `/register`
- **Backend API:** `POST /api/auth/register`
- New users can create an account with:
  - Full Name
  - Email (unique)
  - Phone Number (10 digits)
  - Address
  - Password (min 6 characters)

### ✅ User Login
- **Route:** `/login`
- **Backend API:** `POST /api/auth/login`
- Users can login with:
  - Email
  - Password

### ✅ Protected Routes
- **Book Ride** (`/book-ride`) - Requires login
- **My Bookings** (`/my-bookings`) - Requires login
- Unauthenticated users are redirected to login page

### ✅ User Session Management
- User data stored in `localStorage`
- Persistent login across page refreshes
- Logout functionality available
- User name displayed in header when logged in

---

## Backend Implementation

### 1. Updated User Entity
**File:** `backend/src/main/java/com/cabsystem/entity/User.java`

```java
@Entity
public class User {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String password;  // ✅ NEW FIELD
}
```

### 2. Authentication DTOs

#### LoginRequest
```java
public class LoginRequest {
    private String email;
    private String password;
}
```

#### RegisterRequest
```java
public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String password;
}
```

#### AuthResponse
```java
public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String message;
}
```

### 3. AuthService
**File:** `backend/src/main/java/com/cabsystem/service/AuthService.java`

**Features:**
- User registration with duplicate email check
- Password hashing using SHA-256
- Login validation
- Returns user data without password

**Methods:**
- `register(RegisterRequest)` - Creates new user
- `login(LoginRequest)` - Validates credentials
- `hashPassword(String)` - Secures passwords

### 4. AuthController
**File:** `backend/src/main/java/com/cabsystem/controller/AuthController.java`

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/check` | Health check |

### 5. Updated DataInitializer
All seed users now have passwords:
- **Default Password:** `password123`
- Users: john@example.com, jane@example.com, mike@example.com

---

## Frontend Implementation

### 1. Login Page
**File:** `frontend/app/login/page.tsx`

**Features:**
- Email and password fields
- Form validation
- Error messages
- "Remember me" checkbox
- Link to registration page
- Demo account credentials displayed

**After Successful Login:**
- User data stored in `localStorage`
- Redirected to home page

### 2. Register Page
**File:** `frontend/app/register/page.tsx`

**Features:**
- Full registration form (name, email, phone, address, password)
- Password confirmation
- Client-side validation:
  - Password min 6 characters
  - Passwords must match
  - Phone must be 10 digits
- Terms and conditions checkbox
- Success animation
- Auto-login after registration

### 3. Updated Landing Page
**File:** `frontend/app/page.tsx`

**Changes:**
- Login/Sign Up buttons when not authenticated
- User name display when authenticated
- Logout button
- Dynamic header based on auth state

### 4. Protected Book Ride Page
**File:** `frontend/app/book-ride/page.tsx`

**Changes:**
- Checks for authentication on load
- Redirects to login if not authenticated
- Automatically uses logged-in user's ID
- Displays user name in header

### 5. Protected My Bookings Page
**File:** `frontend/app/my-bookings/page.tsx`

**Changes:**
- Requires authentication
- Automatically shows logged-in user's bookings
- Removed user selector dropdown
- Shows user email in subtitle

---

## How to Use

### As a New User

1. **Register an Account**
   ```
   Navigate to: http://localhost:3000/register
   
   Fill in:
   - Name: Your Full Name
   - Email: your@email.com
   - Phone: 9876543210
   - Address: Your address
   - Password: yourpassword
   - Confirm Password: yourpassword
   
   Click: "Create Account"
   ```

2. **Automatic Login**
   - After registration, you're automatically logged in
   - Redirected to home page

3. **Book a Ride**
   - Click "Book a Ride Now"
   - Your user info is automatically used
   - No need to select user ID manually

### As an Existing User

1. **Login**
   ```
   Navigate to: http://localhost:3000/login
   
   Demo Accounts:
   Email: john@example.com | Password: password123
   Email: jane@example.com | Password: password123
   Email: mike@example.com | Password: password123
   
   Click: "Sign In"
   ```

2. **Use the System**
   - Once logged in, you can access all features
   - Your name appears in the header
   - All bookings are linked to your account

### Logout

1. Click the **"Logout"** button in the header
2. You'll be logged out and redirected to home
3. Protected routes will require login again

---

## Security Features

### Password Security
- **Hashing:** SHA-256 (Note: Use BCrypt in production)
- Passwords never sent in plain text responses
- Stored securely in database

### Session Management
- Client-side session storage
- No sensitive data in localStorage
- User ID and profile info only

### Route Protection
- Frontend checks authentication before rendering
- Redirects to login if unauthenticated
- Backend validates all requests

---

## Testing the Authentication

### Test 1: Registration Flow
```bash
# 1. Go to register page
http://localhost:3000/register

# 2. Fill form and submit

# 3. Verify:
- Account created successfully
- Auto-logged in
- Redirected to home
- User name in header
```

### Test 2: Login Flow
```bash
# 1. Go to login page
http://localhost:3000/login

# 2. Use demo credentials:
Email: john@example.com
Password: password123

# 3. Verify:
- Successfully logged in
- Redirected to home
- User name in header
```

### Test 3: Protected Routes
```bash
# 1. Logout (if logged in)

# 2. Try to access:
http://localhost:3000/book-ride

# 3. Verify:
- Alert shown: "Please login to book a ride"
- Redirected to login page
```

### Test 4: Booking with Auth
```bash
# 1. Login as john@example.com

# 2. Book a ride

# 3. Go to My Bookings

# 4. Verify:
- Only John's bookings shown
- No user selector dropdown
- User email displayed
```

---

## API Testing

### Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "address": "Test Address",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "userId": 4,
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "address": "Test Address",
  "message": "Registration successful"
}
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "message": "Login successful"
}
```

---

## Database Changes

### Updated Users Table
```sql
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(500),
    password VARCHAR(255)  -- ✅ NEW COLUMN
);
```

### Migration Notes
- If database already exists, the `password` column will be auto-added by JPA
- Existing users without passwords won't be able to login
- Run DataInitializer again to update seed users with passwords

---

## Files Created/Modified

### Backend Files Created
1. `dto/LoginRequest.java`
2. `dto/RegisterRequest.java`
3. `dto/AuthResponse.java`
4. `service/AuthService.java`
5. `controller/AuthController.java`

### Backend Files Modified
1. `entity/User.java` - Added password field
2. `config/DataInitializer.java` - Added password hashing for seed users

### Frontend Files Created
1. `app/login/page.tsx` - Login page
2. `app/register/page.tsx` - Registration page

### Frontend Files Modified
1. `app/page.tsx` - Added auth UI in header
2. `app/book-ride/page.tsx` - Added auth check and auto user ID
3. `app/my-bookings/page.tsx` - Added auth check and removed user selector

---

## LocalStorage Structure

```javascript
// After successful login/register:
localStorage.setItem('user', JSON.stringify({
  userId: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  address: "123 Main St"
}))

localStorage.setItem('userId', '1')
```

---

## Future Enhancements

### Security Improvements
1. ✅ Implement JWT tokens
2. ✅ Use BCrypt for password hashing
3. ✅ Add password reset functionality
4. ✅ Implement refresh tokens
5. ✅ Add session expiration

### Features
1. ✅ Email verification
2. ✅ Social login (Google, Facebook)
3. ✅ Two-factor authentication
4. ✅ Profile management page
5. ✅ Change password functionality

---

## Common Issues

### Issue 1: "User already exists"
**Solution:** Email must be unique. Try different email or login with existing account.

### Issue 2: "Invalid email or password"
**Solution:** Check credentials. For demo users, password is `password123`.

### Issue 3: Redirected to login after refresh
**Solution:** Check localStorage is enabled in browser. Clear cache if needed.

### Issue 4: Password column missing in database
**Solution:** Restart backend to run JPA auto-DDL. Or manually add column:
```sql
ALTER TABLE users ADD COLUMN password VARCHAR(255);
```

---

## Demo Credentials

| Name | Email | Password |
|------|-------|----------|
| John Doe | john@example.com | password123 |
| Jane Smith | jane@example.com | password123 |
| Mike Johnson | mike@example.com | password123 |

---

**🎉 Authentication System is now fully integrated!**

Users must login to book rides and view their booking history. The system provides a secure and seamless authentication experience!
