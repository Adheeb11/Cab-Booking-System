'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mockApi } from '@/lib/mockData'

export default function MyBookings() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    const userId = localStorage.getItem('userId')
    
    if (!userData || !userId) {
      alert('Please login to view your bookings')
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchBookings(parseInt(userId))
  }, [router])

  const fetchBookings = async (userId: number) => {
    try {
      setLoading(true)
      const bookings = await mockApi.getUserBookings(userId)
      setBookings(bookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <Link href="/book-ride">
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  🚀 Book New Ride
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📋 My Bookings</h2>
          <p className="text-gray-600">View and manage your ride history - {user.email}</p>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <Link href="/book-ride">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                🚀 Book Your First Ride
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Booking #{booking.bookingId}
                      </h3>
                      {booking.ecoRide && (
                        <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                          🌱 Eco-Friendly
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {formatDate(booking.bookingTime)}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span
                      className={`px-4 py-2 rounded-full font-bold text-sm ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Trip Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Trip Details</h4>
                    <div className="flex items-start space-x-2">
                      <span className="text-xl">📍</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.pickupLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-xl">🎯</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Drop</p>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.dropLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-4 pt-2">
                      <div className="bg-gray-50 rounded-lg p-2 flex-1">
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="text-sm font-bold text-gray-900">
                          {booking.distance} km
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 flex-1">
                        <p className="text-xs text-gray-500">Fare</p>
                        <p className="text-sm font-bold text-primary">
                          ₹{booking.fare?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cab & Driver Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Cab & Driver</h4>
                    <div className="bg-indigo-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Cab:</span>
                        <span className="text-sm font-bold text-gray-900">
                          {booking.cabNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Type:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {booking.cabType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Driver:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {booking.driverName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Phone:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {booking.driverPhone}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Payment:</span>
                        <span className="text-sm font-bold text-gray-900">
                          {booking.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eco-Ride Carbon Savings */}
                {booking.ecoRide && booking.carbonSaved > 0 && (
                  <div className="mt-4 bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">🌱</span>
                        <div>
                          <p className="text-sm opacity-90">Carbon Saved</p>
                          <p className="text-2xl font-bold">
                            {booking.carbonSaved?.toFixed(2)} kg CO₂
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-90">Eco-Friendly Ride</p>
                        <p className="text-sm font-semibold">Thank you! 🌍</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && bookings.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {bookings.length}
              </div>
              <div className="text-gray-600 font-medium">Total Rides</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {bookings.filter((b) => b.ecoRide).length}
              </div>
              <div className="text-gray-600 font-medium">Eco Rides</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                {bookings
                  .reduce((sum, b) => sum + (b.carbonSaved || 0), 0)
                  .toFixed(2)} kg
              </div>
              <div className="text-gray-600 font-medium">CO₂ Saved</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
