# 🔗 Frontend-Backend Integration Guide

## Overview

This guide shows how to connect the existing Next.js frontend to the new Spring Boot backend.

---

## 🎯 Current Status

### ✅ Backend (Complete)

- Running on: http://localhost:8080
- 17 REST API endpoints
- MySQL database with seed data
- CORS enabled for frontend

### 📱 Frontend (Currently Standalone)

- Running on: http://localhost:3000
- Using mock data from `lib/mockData.ts`
- Needs to be connected to backend APIs

---

## 🔄 Integration Steps

### Step 1: Install Axios (if not already installed)

```bash
cd frontend
npm install axios
```

### Step 2: Create API Configuration

Create `frontend/lib/api.ts`:

```typescript
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

### Step 3: Update Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 📝 API Integration Examples

### Authentication

#### Login

**Replace in:** `frontend/app/login/page.tsx`

**Before (Mock):**

```typescript
import { mockApi } from "@/lib/mockData";
const response = await mockApi.login(email, password);
```

**After (Real API):**

```typescript
import api from "@/lib/api";

const response = await api.post("/auth/login", {
  email,
  password,
});

const user = response.data;
```

#### Register

**Replace in:** `frontend/app/register/page.tsx`

**Before (Mock):**

```typescript
const response = await mockApi.register(userData);
```

**After (Real API):**

```typescript
const response = await api.post("/auth/register", {
  name,
  email,
  phone,
  address,
  password,
});

const user = response.data;
```

---

### Booking

#### Create Booking

**Replace in:** `frontend/app/book-ride/page.tsx`

**Before (Mock):**

```typescript
const booking = await mockApi.createBooking(bookingData);
```

**After (Real API):**

```typescript
const response = await api.post("/bookings", {
  userId: user.userId,
  pickupLocation,
  dropLocation,
  distance,
  ecoRide,
  paymentMethod,
  // Payment-specific fields
  upiId: paymentMethod === "UPI" ? upiId : undefined,
  cardNumber: paymentMethod === "CARD" ? cardNumber : undefined,
  cardType: paymentMethod === "CARD" ? cardType : undefined,
  bankName: paymentMethod === "CARD" ? bankName : undefined,
  cardHolderName: paymentMethod === "CARD" ? cardHolderName : undefined,
  receivedAmount: paymentMethod === "CASH" ? receivedAmount : undefined,
  collectedBy: paymentMethod === "CASH" ? driverName : undefined,
});

const booking = response.data;
```

#### Get User Bookings

**Replace in:** `frontend/app/my-bookings/page.tsx`

**Before (Mock):**

```typescript
const bookings = mockApi.getUserBookings(userId);
```

**After (Real API):**

```typescript
const response = await api.get(`/bookings/user/${userId}`);
const bookings = response.data;
```

---

### Cabs

#### Get Available Cabs

**Add in:** `frontend/app/book-ride/page.tsx`

```typescript
const response = await api.get("/cabs/available");
const availableCabs = response.data;
```

#### Get Eco Cabs

```typescript
const response = await api.get("/cabs/eco");
const ecoCabs = response.data;
```

---

## 🔧 Complete API Service

Create `frontend/lib/apiService.ts`:

```typescript
import api from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};

export const bookingService = {
  create: async (bookingData: any) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  createEco: async (bookingData: any) => {
    const response = await api.post("/bookings/eco", bookingData);
    return response.data;
  },

  getUserBookings: async (userId: number) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
};

export const cabService = {
  getAll: async () => {
    const response = await api.get("/cabs");
    return response.data;
  },

  getAvailable: async () => {
    const response = await api.get("/cabs/available");
    return response.data;
  },

  getEco: async () => {
    const response = await api.get("/cabs/eco");
    return response.data;
  },
};

export const userService = {
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};
```

---

## 🎨 Updated Component Example

### Login Page

**File:** `frontend/app/login/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/apiService'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await authService.login(email, password)

      if (user.success) {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(user))

        // Redirect to home
        router.push('/')
      } else {
        setError(user.message || 'Login failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // ... rest of your JSX
  )
}
```

---

## 🧪 Testing Integration

### 1. Start Backend

```bash
cd backend
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Test Flow

1. Open http://localhost:3000
2. Click "Login"
3. Use: john@example.com / password123
4. Create a booking
5. Check "My Bookings"

### 4. Verify Backend Logs

```bash
# Check backend console for API calls
# Check logs/booking-logs.txt for booking logs
```

---

## 🔍 API Response Mapping

### Backend Response → Frontend Type

#### User

```typescript
interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  // password not included in responses
}
```

#### Booking

```typescript
interface Booking {
  bookingId: number;
  userId: number;
  userName: string;
  userEmail: string;
  pickupLocation: string;
  dropLocation: string;
  distance: number;
  fare: number;
  status: string;
  bookingTime: string;
  ecoRide: boolean;
  carbonSaved: number;
  cabId: number;
  cabNumber: string;
  cabType: string;
  isElectric: boolean;
  driverId: number;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  paymentMethod: string;
  paymentStatus: string;
  message?: string;
}
```

---

## ⚠️ Important Changes

### 1. Payment Processing

- Backend processes payments **asynchronously**
- Initial response has `paymentStatus: "PENDING"`
- Status updates to `"SUCCESS"` after ~1 second
- Frontend should handle pending state

### 2. Cab Availability

- Backend automatically updates cab availability
- Only available cabs are returned
- Use `/api/cabs/available` endpoint

### 3. Carbon Calculation

- Backend calculates carbon savings
- Formula: `distance × 0.10 kg CO2`
- Only for eco rides

---

## 🛠️ Error Handling

### Example Error Handler

```typescript
import axios from "axios";

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    return message;
  }

  return "An unexpected error occurred";
};

// Usage
try {
  const result = await authService.login(email, password);
} catch (error) {
  const errorMessage = handleApiError(error);
  setError(errorMessage);
}
```

---

## 📊 Migration Checklist

- [ ] Install axios in frontend
- [ ] Create `lib/api.ts` with base configuration
- [ ] Create `lib/apiService.ts` with API methods
- [ ] Create `.env.local` with API URL
- [ ] Update `app/login/page.tsx` to use real API
- [ ] Update `app/register/page.tsx` to use real API
- [ ] Update `app/book-ride/page.tsx` to use real API
- [ ] Update `app/my-bookings/page.tsx` to use real API
- [ ] Update `app/booking-summary/page.tsx` if needed
- [ ] Remove or comment out `lib/mockData.ts`
- [ ] Test all flows end-to-end
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Add retry logic if needed

---

## 🎯 Key Differences: Mock vs Real API

| Feature            | Mock API             | Real API                |
| ------------------ | -------------------- | ----------------------- |
| **Data Storage**   | localStorage         | MySQL database          |
| **Booking ID**     | Auto-increment in JS | Database auto-increment |
| **Cab Assignment** | Random from array    | Smart algorithm         |
| **Payment**        | Instant              | Asynchronous (~1s)      |
| **Validation**     | Client-side only     | Server-side + client    |
| **Persistence**    | Browser only         | Permanent database      |
| **Multi-user**     | Single browser       | All users shared        |

---

## 🚀 Production Considerations

### Environment Variables

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### CORS Configuration

Backend already configured for:

- http://localhost:3000
- http://localhost:3001
- http://localhost:3002

For production, update `backend/src/main/java/com/cabsystem/config/CorsConfig.java`

---

## 📚 Additional Resources

- **Backend API Docs:** `API_DOCUMENTATION.md`
- **Backend Setup:** `BACKEND_SETUP.md`
- **OOP Concepts:** `OOP_CONCEPTS.md`

---

## 🎉 You're Ready!

Your backend is fully functional and ready to integrate with the frontend!

**Next Steps:**

1. Start both backend and frontend
2. Update frontend to use API service
3. Test all features
4. Deploy when ready

---

**Happy Coding! 🚕**
