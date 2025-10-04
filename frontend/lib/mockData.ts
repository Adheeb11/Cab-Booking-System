// Mock Data for Standalone Frontend

export interface User {
  userId: number
  name: string
  email: string
  phone: string
  address: string
  password: string
}

export interface Driver {
  driverId: number
  name: string
  licenseNumber: string
  phone: string
  rating: number
  available: boolean
  email: string
  password: string
}

export interface Cab {
  cabId: number
  cabNumber: string
  cabType: string
  ratePerKm: number
  isElectric: boolean
  seats: number
  isAvailable: boolean
  driver: Driver
}

export interface Booking {
  bookingId: number
  userId: number
  userName: string
  userEmail: string
  pickupLocation: string
  dropLocation: string
  distance: number
  fare: number
  status: string
  bookingTime: string
  ecoRide: boolean
  carbonSaved: number
  cab: Cab
  paymentMethod: string
  paymentDetails: any
  // Direct access fields for convenience
  cabNumber?: string
  cabType?: string
  driverName?: string
  driverPhone?: string
  paymentStatus?: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    userId: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    address: '123 Main St',
    password: 'password123'
  },
  {
    userId: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '9876543211',
    address: '456 Park Ave',
    password: 'password123'
  },
  {
    userId: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '9876543212',
    address: '789 Oak Rd',
    password: 'password123'
  }
]

// Mock Drivers
export const mockDrivers: Driver[] = [
  {
    driverId: 1,
    name: 'Rajesh Kumar',
    licenseNumber: 'DL1234567',
    phone: '9988776655',
    rating: 4.5,
    available: true,
    email: 'rajesh@driver.com',
    password: 'driver123'
  },
  {
    driverId: 2,
    name: 'Amit Sharma',
    licenseNumber: 'DL2345678',
    phone: '9988776656',
    rating: 4.8,
    available: true,
    email: 'amit@driver.com',
    password: 'driver123'
  },
  {
    driverId: 3,
    name: 'Suresh Patel',
    licenseNumber: 'DL3456789',
    phone: '9988776657',
    rating: 4.2,
    available: true,
    email: 'suresh@driver.com',
    password: 'driver123'
  },
  {
    driverId: 4,
    name: 'Vikram Singh',
    licenseNumber: 'DL4567890',
    phone: '9988776658',
    rating: 4.7,
    available: true,
    email: 'vikram@driver.com',
    password: 'driver123'
  },
  {
    driverId: 5,
    name: 'Ravi Verma',
    licenseNumber: 'DL5678901',
    phone: '9988776659',
    rating: 4.6,
    available: true,
    email: 'ravi@driver.com',
    password: 'driver123'
  }
]

// Mock Cabs
export const mockCabs: Cab[] = [
  {
    cabId: 1,
    cabNumber: 'DL-01-AB-1234',
    cabType: 'Sedan',
    ratePerKm: 12.0,
    isElectric: true,
    seats: 4,
    isAvailable: true,
    driver: mockDrivers[0]
  },
  {
    cabId: 2,
    cabNumber: 'DL-02-CD-5678',
    cabType: 'SUV',
    ratePerKm: 15.0,
    isElectric: false,
    seats: 6,
    isAvailable: true,
    driver: mockDrivers[1]
  },
  {
    cabId: 3,
    cabNumber: 'DL-03-EF-9012',
    cabType: 'Hatchback',
    ratePerKm: 10.0,
    isElectric: true,
    seats: 4,
    isAvailable: true,
    driver: mockDrivers[2]
  },
  {
    cabId: 4,
    cabNumber: 'DL-04-GH-3456',
    cabType: 'Sedan',
    ratePerKm: 12.0,
    isElectric: false,
    seats: 4,
    isAvailable: true,
    driver: mockDrivers[3]
  },
  {
    cabId: 5,
    cabNumber: 'DL-05-IJ-7890',
    cabType: 'SUV',
    ratePerKm: 15.0,
    isElectric: true,
    seats: 7,
    isAvailable: true,
    driver: mockDrivers[4]
  }
]

// Sample bookings with driver assignments
const getDefaultBookings = (): Booking[] => [
  {
    bookingId: 1,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john@pax.com',
    pickupLocation: 'Connaught Place, Delhi',
    dropLocation: 'India Gate, Delhi',
    distance: 3.5,
    fare: 92.0,
    status: 'CONFIRMED',
    bookingTime: new Date().toISOString(),
    ecoRide: true,
    carbonSaved: 0.35,
    cab: mockCabs[0],
    paymentMethod: 'UPI',
    paymentDetails: { upiId: 'john@pax.com' },
    cabNumber: mockCabs[0].cabNumber,
    cabType: mockCabs[0].cabType,
    driverName: mockCabs[0].driver.name,
    driverPhone: mockCabs[0].driver.phone,
    paymentStatus: 'PENDING'
  },
  {
    bookingId: 2,
    userId: 2,
    userName: 'Jane Smith',
    userEmail: 'jane@pax.com',
    pickupLocation: 'Paharganj, Delhi',
    dropLocation: 'New Delhi Railway Station',
    distance: 2.0,
    fare: 80.0,
    status: 'CONFIRMED',
    bookingTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    ecoRide: false,
    carbonSaved: 0,
    cab: mockCabs[1],
    paymentMethod: 'CARD',
    paymentDetails: { cardNumber: '1234', cardType: 'CREDIT', bankName: 'SBI' },
    cabNumber: mockCabs[1].cabNumber,
    cabType: mockCabs[1].cabType,
    driverName: mockCabs[1].driver.name,
    driverPhone: mockCabs[1].driver.phone,
    paymentStatus: 'PENDING'
  }
]

// Initialize bookings from localStorage or default bookings
const getStoredBookings = (): Booking[] => {
  if (typeof window === 'undefined') return getDefaultBookings()
  const stored = localStorage.getItem('mockBookings')
  if (!stored) {
    // Store default bookings if none exist
    const defaultBookings = getDefaultBookings()
    localStorage.setItem('mockBookings', JSON.stringify(defaultBookings))
    return defaultBookings
  }
  return JSON.parse(stored)
}

const saveBookings = (bookings: Booking[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockBookings', JSON.stringify(bookings))
  }
}

// Mock API Functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate delay
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    const { password: _, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      message: 'Login successful'
    }
  },

  register: async (userData: Omit<User, 'userId'>) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if email exists
    const existingUser = mockUsers.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create new user
    const newUser: User = {
      userId: mockUsers.length + 1,
      ...userData
    }
    mockUsers.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return {
      ...userWithoutPassword,
      message: 'Registration successful'
    }
  },

  driverLogin: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate delay
    const driver = mockDrivers.find(d => d.email === email && d.password === password)
    if (!driver) {
      throw new Error('Invalid driver credentials')
    }
    const { password: _, ...driverWithoutPassword } = driver
    return {
      ...driverWithoutPassword,
      message: 'Driver login successful'
    }
  },

  // Bookings
  createBooking: async (bookingData: any) => {
    await new Promise(resolve => setTimeout(resolve, 800))

    const user = mockUsers.find(u => u.userId === bookingData.userId)
    if (!user) throw new Error('User not found')

    // Select cab based on eco preference
    let selectedCab: Cab
    if (bookingData.ecoRide) {
      const ecoCabs = mockCabs.filter(c => c.isElectric && c.isAvailable)
      selectedCab = ecoCabs.length > 0 ? ecoCabs[0] : mockCabs.filter(c => c.isAvailable)[0]
    } else {
      selectedCab = mockCabs.filter(c => c.isAvailable)[0]
    }

    if (!selectedCab) throw new Error('No cabs available')

    // Calculate fare (using same logic as frontend)
    const distance = parseFloat(bookingData.distance)
    const baseFare = 50
    const perKmRate = bookingData.ecoRide ? 12 : 15
    const fare = baseFare + (distance * perKmRate)

    // Calculate carbon savings
    let carbonSaved = 0
    if (bookingData.ecoRide && selectedCab.isElectric) {
      carbonSaved = distance * 0.10 // 0.12 - 0.02
    }

    // Create booking
    const bookings = getStoredBookings()
    const newBooking: Booking = {
      bookingId: bookings.length + 1,
      userId: bookingData.userId,
      userName: user.name,
      userEmail: user.email,
      pickupLocation: bookingData.pickupLocation,
      dropLocation: bookingData.dropLocation,
      distance: distance,
      fare: fare,
      status: 'CONFIRMED',
      bookingTime: new Date().toISOString(),
      ecoRide: bookingData.ecoRide || false,
      carbonSaved: carbonSaved,
      cab: selectedCab,
      paymentMethod: bookingData.paymentMethod,
      paymentDetails: {
        upiId: bookingData.upiId,
        cardNumber: bookingData.cardNumber,
        cardType: bookingData.cardType,
        bankName: bookingData.bankName,
        receivedAmount: bookingData.receivedAmount
      },
      // Add direct access fields for booking summary
      cabNumber: selectedCab.cabNumber,
      cabType: selectedCab.cabType,
      driverName: selectedCab.driver.name,
      driverPhone: selectedCab.driver.phone,
      paymentStatus: 'PENDING'
    }

    bookings.push(newBooking)
    saveBookings(bookings)

    return newBooking
  },

  getUserBookings: async (userId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const bookings = getStoredBookings()
    return bookings.filter(b => b.userId === userId)
  },

  getAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockUsers.map(({ password, ...user }) => user)
  },

  getAvailableCabs: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockCabs.filter(c => c.isAvailable)
  },

  getEcoCabs: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockCabs.filter(c => c.isElectric && c.isAvailable)
  },

  // Driver functions
  getDriverAssignments: async (driverId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const bookings = getStoredBookings()
    return bookings.filter(b => b.cab.driver.driverId === driverId && b.status !== 'COMPLETED')
  },

  completeRide: async (bookingId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const bookings = getStoredBookings()
    const bookingIndex = bookings.findIndex(b => b.bookingId === bookingId)
    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }
    bookings[bookingIndex].status = 'COMPLETED'
    saveBookings(bookings)
    return bookings[bookingIndex]
  },

  getAllBookings: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return getStoredBookings()
  }
}
