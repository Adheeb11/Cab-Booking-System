'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mockApi } from '@/lib/mockData'

export default function DriverDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [driver, setDriver] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [completedRides, setCompletedRides] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'assignments' | 'completed'>('assignments')

  useEffect(() => {
    // Check if driver is logged in
    const driverData = localStorage.getItem('driver')
    const driverId = localStorage.getItem('driverId')
    
    if (!driverData || !driverId) {
      // Redirect to login if not authenticated
      alert('Please login as a driver')
      router.push('/login')
      return
    }
    
    const parsedDriver = JSON.parse(driverData)
    setDriver(parsedDriver)
    loadAssignments(parseInt(driverId))
    loadCompletedRides(parseInt(driverId))
  }, [router])

  const loadAssignments = async (driverId: number) => {
    try {
      const assignments = await mockApi.getDriverAssignments(driverId)
      setAssignments(assignments)
    } catch (error) {
      console.error('Error loading assignments:', error)
    }
  }

  const loadCompletedRides = async (driverId: number) => {
    try {
      const allBookings = await mockApi.getAllBookings()
      const completed = allBookings.filter(b => 
        b.cab.driver.driverId === driverId && b.status === 'COMPLETED'
      )
      setCompletedRides(completed)
    } catch (error) {
      console.error('Error loading completed rides:', error)
    }
  }

  const handleCompleteRide = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to mark this ride as completed?')) {
      return
    }

    setLoading(true)
    try {
      await mockApi.completeRide(bookingId)
      // Reload assignments and completed rides
      const driverId = parseInt(localStorage.getItem('driverId') || '0')
      await loadAssignments(driverId)
      await loadCompletedRides(driverId)
      alert('Ride completed successfully! 🎉')
    } catch (error: any) {
      alert('Error completing ride: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('driver')
    localStorage.removeItem('driverId')
    router.push('/login')
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
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
              <div className="text-center">
                <div className="text-sm text-gray-600">Driver</div>
                <div className="font-semibold">👤 {driver.name}</div>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Driver Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🚗</div>
            <div className="text-2xl font-bold text-blue-600">{driver.cabNumber || 'DL-01-AB-1234'}</div>
            <div className="text-sm text-gray-600">Cab Number</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-blue-600">{driver.rating}</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
            <div className="text-sm text-gray-600">Active Assignments</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-blue-600">{completedRides.length}</div>
            <div className="text-sm text-gray-600">Completed Rides</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assignments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Active Assignments ({assignments.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ✅ Completed Rides ({completedRides.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'assignments' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Active Ride Assignments</h3>
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Assignments</h3>
                    <p className="text-gray-600">You don't have any active ride assignments at the moment.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {assignments.map((assignment) => (
                      <div key={assignment.bookingId} className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">#BK{assignment.bookingId}</h4>
                            <p className="text-sm text-gray-600">
                              Booked: {formatTime(assignment.bookingTime)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              {formatCurrency(assignment.fare)}
                            </div>
                            {assignment.ecoRide && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🌱 Eco Ride
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">📍</span>
                              <div>
                                <div className="font-semibold text-gray-900">Pickup Location</div>
                                <div className="text-gray-600">{assignment.pickupLocation}</div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">🎯</span>
                              <div>
                                <div className="font-semibold text-gray-900">Drop Location</div>
                                <div className="text-gray-600">{assignment.dropLocation}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-center">
                              <div className="text-2xl mb-1">📏</div>
                              <div className="font-bold text-gray-900">{assignment.distance} km</div>
                              <div className="text-xs text-gray-600">Distance</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-center">
                              <div className="text-2xl mb-1">👤</div>
                              <div className="font-bold text-gray-900">{assignment.userName}</div>
                              <div className="text-xs text-gray-600">Customer</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-center">
                              <div className="text-2xl mb-1">💳</div>
                              <div className="font-bold text-gray-900">{assignment.paymentMethod}</div>
                              <div className="text-xs text-gray-600">Payment</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 mb-4">
                          <h5 className="font-semibold text-gray-900 mb-3">Cab & Driver Info</h5>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="font-semibold text-gray-700">Cab Number:</div>
                              <div className="text-gray-600">{assignment.cab.cabNumber}</div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-700">Cab Type:</div>
                              <div className="text-gray-600">{assignment.cab.cabType}</div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-700">Driver Name:</div>
                              <div className="text-gray-600">{assignment.cab.driver.name}</div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-700">Driver Phone:</div>
                              <div className="text-gray-600">{assignment.cab.driver.phone}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCompleteRide(assignment.bookingId)}
                            disabled={loading}
                            className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all ${
                              loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                            }`}
                          >
                            {loading ? '⏳ Processing...' : '✅ Mark Ride Complete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Completed Rides History</h3>
                {completedRides.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Rides</h3>
                    <p className="text-gray-600">Complete your first ride to see it here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedRides.map((ride) => (
                      <div key={ride.bookingId} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">#BK{ride.bookingId}</h4>
                            <p className="text-sm text-gray-600">
                              Completed: {formatTime(ride.bookingTime)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              {formatCurrency(ride.fare)}
                            </div>
                            {ride.ecoRide && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🌱 Eco Ride
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="font-semibold text-gray-700">Route:</div>
                            <div className="text-gray-600">{ride.pickupLocation} → {ride.dropLocation}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">Customer:</div>
                            <div className="text-gray-600">{ride.userName}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">Distance:</div>
                            <div className="text-gray-600">{ride.distance} km</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">Payment:</div>
                            <div className="text-gray-600">{ride.paymentMethod}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
