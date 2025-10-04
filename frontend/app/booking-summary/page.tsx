'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BookingSummary() {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const bookingData = sessionStorage.getItem('latestBooking')
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
    } else {
      router.push('/book-ride')
    }
  }, [router])

  if (!booking) {
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Banner */}
        <div className="bg-green-500 text-white rounded-2xl p-6 mb-8 text-center shadow-xl">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-lg">Your ride has been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Booking Details
            </h3>
            <p className="text-gray-500">Booking ID: #{booking.bookingId}</p>
          </div>

          {/* Trip Information */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📍</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500">Pickup Location</p>
                <p className="text-lg font-medium text-gray-900">{booking.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl">🎯</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500">Drop Location</p>
                <p className="text-lg font-medium text-gray-900">{booking.dropLocation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-500">Distance</p>
                <p className="text-xl font-bold text-primary">{booking.distance} km</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-500">Fare</p>
                <p className="text-xl font-bold text-primary">₹{booking.fare?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Cab & Driver Information */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="text-xl font-bold text-gray-900">Your Cab & Driver</h4>
            
            <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cab Number:</span>
                <span className="font-bold text-gray-900">{booking.cabNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cab Type:</span>
                <span className="font-bold text-gray-900">{booking.cabType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver Name:</span>
                <span className="font-bold text-gray-900">{booking.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver Phone:</span>
                <span className="font-bold text-gray-900">{booking.driverPhone}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="text-xl font-bold text-gray-900">Payment Details</h4>
            
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-bold text-gray-900">{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-bold ${booking.paymentStatus === 'SUCCESS' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {booking.paymentStatus || 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-700">Total Amount:</span>
                <span className="font-bold text-2xl text-primary">₹{booking.fare?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Eco-Ride Badge */}
          {booking.ecoRide && booking.carbonSaved > 0 && (
            <div className="border-t pt-6">
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white text-center shadow-lg eco-badge">
                <div className="text-5xl mb-3">🌱</div>
                <h4 className="text-2xl font-bold mb-2">Eco-Friendly Ride!</h4>
                <p className="text-lg mb-2">You're helping save the environment!</p>
                <div className="bg-white text-green-600 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold mb-1">Carbon Saved</p>
                  <p className="text-4xl font-bold">{booking.carbonSaved?.toFixed(2)} kg CO₂</p>
                </div>
                <p className="mt-4 text-sm opacity-90">
                  Thank you for choosing an electric vehicle! 🚗⚡
                </p>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
              <div>
                <p className="text-sm opacity-90">Booking Status</p>
                <p className="text-2xl font-bold">{booking.status}</p>
              </div>
              <div className="text-5xl">🎉</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Link href="/" className="flex-1">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all">
                🏠 Back to Home
              </button>
            </Link>
            <Link href="/my-bookings" className="flex-1">
              <button className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all">
                📋 View All Bookings
              </button>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Your driver will arrive shortly. Please be ready at the pickup location.
                You can contact your driver at <strong>{booking.driverPhone}</strong>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
