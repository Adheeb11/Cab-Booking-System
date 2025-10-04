'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic import of OSMMapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/OSMMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

interface BookingData {
  pickupLocation: string
  dropLocation: string
  pickupLat: number | null
  pickupLng: number | null
  dropLat: number | null
  dropLng: number | null
  bookingTime: string
  distance: string
  cabType: string
  paymentMethod: string
  cardNumber: string
  cardExpiry: string
  cardCVV: string
  upiId: string
}

export default function BookRide() {
  const router = useRouter()
  const [showMap, setShowMap] = useState(false)
  
  // Location search states
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([])
  const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion[]>([])
  const [pickupSearchLoading, setPickupSearchLoading] = useState(false)
  const [dropSearchLoading, setDropSearchLoading] = useState(false)
  
  // Route state
  const [routeData, setRouteData] = useState<any>(null)
  
  const [bookingData, setBookingData] = useState<BookingData>({
    pickupLocation: '',
    dropLocation: '',
    pickupLat: null,
    pickupLng: null,
    dropLat: null,
    dropLng: null,
    bookingTime: '',
    distance: '',
    cabType: 'sedan',
    paymentMethod: 'cash',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    upiId: ''
  })

  // Search location using Nominatim API
  const searchLocation = async (query: string, isPickup: boolean) => {
    if (query.length < 3) {
      if (isPickup) setPickupSuggestions([])
      else setDropSuggestions([])
      return
    }

    if (isPickup) setPickupSearchLoading(true)
    else setDropSearchLoading(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      )
      const data = await response.json()
      
      if (isPickup) {
        setPickupSuggestions(data)
      } else {
        setDropSuggestions(data)
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
    } finally {
      if (isPickup) setPickupSearchLoading(false)
      else setDropSearchLoading(false)
    }
  }

  // Handle location selection from suggestions
  const selectLocation = (suggestion: LocationSuggestion, isPickup: boolean) => {
    const lat = parseFloat(suggestion.lat)
    const lng = parseFloat(suggestion.lon)
    
    if (isPickup) {
      setBookingData(prev => ({
        ...prev,
        pickupLocation: suggestion.display_name,
        pickupLat: lat,
        pickupLng: lng
      }))
      setPickupSuggestions([])
      
      // Calculate route if drop location is set
      if (bookingData.dropLat && bookingData.dropLng) {
        calculateRoute(lat, lng, bookingData.dropLat, bookingData.dropLng)
      }
    } else {
      setBookingData(prev => ({
        ...prev,
        dropLocation: suggestion.display_name,
        dropLat: lat,
        dropLng: lng
      }))
      setDropSuggestions([])
      
      // Calculate route if pickup location is set
      if (bookingData.pickupLat && bookingData.pickupLng) {
        calculateRoute(bookingData.pickupLat, bookingData.pickupLng, lat, lng)
      }
    }
  }

  // Calculate route using OSRM API
  const calculateRoute = async (pickupLat: number, pickupLng: number, dropLat: number, dropLng: number) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropLng},${dropLat}?overview=full&geometries=geojson`
      )
      const data = await response.json()
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const distanceKm = (route.distance / 1000).toFixed(2)
        
        // Store route data for map display
        setRouteData(route)
        
        setBookingData(prev => ({
          ...prev,
          distance: distanceKm
        }))
      }
    } catch (error) {
      console.error('Error calculating route:', error)
      alert('Could not calculate route. Please try again.')
    }
  }

  const calculateFare = () => {
    const distance = parseFloat(bookingData.distance)
    if (isNaN(distance)) return 0

    const baseRates: { [key: string]: number } = {
      sedan: 10,
      suv: 15,
      luxury: 25,
      auto: 8,
      bike: 5
    }

    const baseRate = baseRates[bookingData.cabType] || 10
    return (distance * baseRate).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bookingData.pickupLat || !bookingData.pickupLng || !bookingData.dropLat || !bookingData.dropLng) {
      alert('Please select valid pickup and drop locations from the suggestions')
      return
    }

    if (!bookingData.distance) {
      alert('Distance could not be calculated. Please try selecting locations again.')
      return
    }

    const fare = calculateFare()
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login to book a ride')
      router.push('/login')
      return
    }

    try {
      const fareValue = typeof fare === 'string' ? parseFloat(fare) : fare
      
      const payload = {
        pickupLocation: bookingData.pickupLocation,
        dropLocation: bookingData.dropLocation,
        pickupLatitude: bookingData.pickupLat,
        pickupLongitude: bookingData.pickupLng,
        dropLatitude: bookingData.dropLat,
        dropLongitude: bookingData.dropLng,
        bookingTime: bookingData.bookingTime,
        distance: parseFloat(bookingData.distance),
        cabType: bookingData.cabType,
        fare: fareValue,
        paymentMethod: bookingData.paymentMethod,
        status: 'PENDING'
      }

      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const booking = await response.json()
        router.push(`/booking-summary?id=${booking.id}`)
      } else {
        const error = await response.text()
        alert(`Booking failed: ${error}`)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
          <p className="text-gray-600">Quick and easy cab booking with real-time route calculation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pickup Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bookingData.pickupLocation}
                    onChange={(e) => {
                      const value = e.target.value
                      setBookingData(prev => ({ ...prev, pickupLocation: value }))
                      searchLocation(value, true)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search for pickup location..."
                    required
                  />
                  {pickupSearchLoading && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {bookingData.pickupLat && bookingData.pickupLng && (
                    <div className="absolute right-3 top-3 text-green-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {pickupSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {pickupSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        onClick={() => selectLocation(suggestion, true)}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <p className="text-sm text-gray-900">{suggestion.display_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drop Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bookingData.dropLocation}
                    onChange={(e) => {
                      const value = e.target.value
                      setBookingData(prev => ({ ...prev, dropLocation: value }))
                      searchLocation(value, false)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search for drop location..."
                    required
                  />
                  {dropSearchLoading && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {bookingData.dropLat && bookingData.dropLng && (
                    <div className="absolute right-3 top-3 text-green-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {dropSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {dropSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        onClick={() => selectLocation(suggestion, false)}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <p className="text-sm text-gray-900">{suggestion.display_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Distance (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="text"
                  value={bookingData.distance}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Will be calculated automatically"
                />
              </div>

              {/* Booking Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Time *
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.bookingTime}
                  onChange={(e) => setBookingData(prev => ({ ...prev, bookingTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Cab Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cab Type *
                </label>
                <select
                  value={bookingData.cabType}
                  onChange={(e) => setBookingData(prev => ({ ...prev, cabType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="sedan">Sedan - ₹10/km</option>
                  <option value="suv">SUV - ₹15/km</option>
                  <option value="luxury">Luxury - ₹25/km</option>
                  <option value="auto">Auto - ₹8/km</option>
                  <option value="bike">Bike - ₹5/km</option>
                </select>
              </div>

              {/* Fare Display */}
              {bookingData.distance && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Estimated Fare:</span>
                    <span className="text-2xl font-bold text-indigo-600">₹{calculateFare()}</span>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  value={bookingData.paymentMethod}
                  onChange={(e) => setBookingData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              {/* Card Details */}
              {bookingData.paymentMethod === 'card' && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={bookingData.cardNumber}
                      onChange={(e) => setBookingData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={bookingData.cardExpiry}
                        onChange={(e) => setBookingData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={bookingData.cardCVV}
                        onChange={(e) => setBookingData(prev => ({ ...prev, cardCVV: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {bookingData.paymentMethod === 'upi' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={bookingData.upiId}
                    onChange={(e) => setBookingData(prev => ({ ...prev, upiId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="yourname@upi"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="lg:hidden p-4 border-b border-gray-200">
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
            
            <div className={`h-[600px] ${showMap ? 'block' : 'hidden lg:block'}`}>
              {bookingData.pickupLat && bookingData.pickupLng && bookingData.dropLat && bookingData.dropLng ? (
                <MapComponent
                  pickupLat={bookingData.pickupLat}
                  pickupLng={bookingData.pickupLng}
                  dropLat={bookingData.dropLat}
                  dropLng={bookingData.dropLng}
                  routeData={routeData}
                  center={[bookingData.pickupLat, bookingData.pickupLng]}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
                  <svg
                    className="w-24 h-24 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Route Map</h3>
                  <p className="text-gray-500 max-w-sm">
                    Select both pickup and drop locations to view the route on the map
                  </p>
                  <div className="mt-6 space-y-2 text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Green marker = Pickup</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Red marker = Drop</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1 bg-indigo-500"></div>
                      <span className="text-sm text-gray-600">Route</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-indigo-600 text-4xl mb-2">🗺️</div>
            <h3 className="font-semibold text-gray-900 mb-1">OpenStreetMap</h3>
            <p className="text-sm text-gray-600">100% Free mapping - No API key required</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-indigo-600 text-4xl mb-2">📍</div>
            <h3 className="font-semibold text-gray-900 mb-1">Smart Search</h3>
            <p className="text-sm text-gray-600">Type 3+ characters to get location suggestions</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-indigo-600 text-4xl mb-2">🚗</div>
            <h3 className="font-semibold text-gray-900 mb-1">Auto Calculate</h3>
            <p className="text-sm text-gray-600">Distance & fare calculated automatically</p>
          </div>
        </div>
      </div>
    </div>
  )
}
