'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mockApi } from '@/lib/mockData'

export default function BookRide() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [calculatedFare, setCalculatedFare] = useState<number>(0)
  const [formData, setFormData] = useState({
    userId: 1, // Will be set from localStorage
    pickupLocation: '',
    dropLocation: '',
    distance: '',
    paymentMethod: 'UPI',
    ecoRide: false,
    // Payment details
    upiId: '',
    cardNumber: '',
    cardType: 'CREDIT',
    bankName: '',
    receivedAmount: ''
  })

  // Fare calculation function
  const calculateFare = (distance: number, ecoRide: boolean): number => {
    const baseFare = 50 // Base fare
    const perKmRate = ecoRide ? 12 : 15 // Eco-ride gets 20% discount
    const totalFare = baseFare + (distance * perKmRate)
    return Math.round(totalFare * 100) / 100 // Round to 2 decimal places
  }

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    const userId = localStorage.getItem('userId')
    
    if (!userData || !userId) {
      // Redirect to login if not authenticated
      alert('Please login to book a ride')
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData(prev => ({
      ...prev,
      userId: parseInt(userId)
    }))
  }, [router])

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    }
    setFormData(newFormData)
    
    // Calculate fare when distance or ecoRide changes
    if (name === 'distance' || name === 'ecoRide') {
      const distance = name === 'distance' ? parseFloat(value) || 0 : parseFloat(newFormData.distance) || 0
      const ride = name === 'ecoRide' ? checked : newFormData.ecoRide
      const fare = calculateFare(distance, ride)
      setCalculatedFare(fare)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        distance: parseFloat(formData.distance),
        calculatedFare: calculatedFare,
        receivedAmount: calculatedFare // Use calculated fare as the amount
      }

      const response = await mockApi.createBooking(payload)
      
      if (response.bookingId) {
        // Store booking data in sessionStorage
        sessionStorage.setItem('latestBooking', JSON.stringify(response))
        router.push('/booking-summary')
      }
    } catch (error: any) {
      alert('Error creating booking: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-3xl">🚕</span>
              <h1 className="text-2xl font-bold text-gray-900">CabBookingPro</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">👤 {user.name}</span>
              <Link href="/my-bookings">
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  📋 My Bookings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            🚀 Book Your Ride
          </h2>
          <p className="text-center text-gray-600 mb-6">Welcome, {user.name}!</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Pickup Location
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter pickup location"
              />
            </div>

            {/* Drop Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Drop Location
              </label>
              <input
                type="text"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter drop location"
              />
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📏 Distance (km)
              </label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                required
                min="0.1"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter distance in kilometers"
              />
            </div>

            {/* Eco-Ride Toggle */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="ecoRide"
                  checked={formData.ecoRide}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <div className="ml-3">
                  <span className="text-lg font-semibold text-gray-900">
                    🌱 Book Eco-Friendly Ride
                  </span>
                  <p className="text-sm text-gray-600">
                    Prioritize electric vehicles or carpools to reduce carbon footprint
                  </p>
                </div>
              </label>
            </div>

            {/* Calculated Fare Display */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  💰 Fare Calculation
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ₹{calculatedFare.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">
                  {formData.ecoRide 
                    ? "Eco-friendly pricing: Base ₹50 + ₹12/km" 
                    : "Standard pricing: Base ₹50 + ₹15/km"
                  }
                </p>
                {formData.distance && (
                  <p className="text-sm text-gray-500 mt-1">
                    Distance: {formData.distance} km
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💳 Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
              </select>
            </div>

            {/* Payment-specific fields */}
            {formData.paymentMethod === 'UPI' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="yourname@upi"
                />
              </div>
            )}

            {formData.paymentMethod === 'CARD' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number (Last 4 digits)
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1234"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Type
                    </label>
                    <select
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="CREDIT">Credit</option>
                      <option value="DEBIT">Debit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Bank name"
                    />
                  </div>
                </div>
              </>
            )}

            {formData.paymentMethod === 'CASH' && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    💵 Cash Payment
                  </h4>
                  <p className="text-gray-600">
                    Pay ₹{calculatedFare.toFixed(2)} in cash to your driver upon arrival
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg transform transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-indigo-700 hover:scale-105'
              }`}
            >
              {loading ? '⏳ Processing...' : '🚀 Confirm Booking'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
