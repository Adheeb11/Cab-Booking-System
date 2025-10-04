'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    setUser(null)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">🚕</span>
              <h1 className="text-3xl font-bold text-gray-900">
                CabBooking<span className="text-primary">Pro</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                <span className="text-2xl">🌱</span>
                <span className="text-sm font-semibold text-green-700">Eco-Friendly</span>
              </div>
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">👤 {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <button className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border-2 border-gray-300 font-semibold">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Your Ride, Your Choice
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Book reliable cabs with ease. Choose eco-friendly options and help save the planet! 🌍
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Fast Booking</h3>
              <p className="text-gray-600">Book your cab in seconds with our streamlined process</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">Choose electric vehicles and reduce your carbon footprint</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold mb-3">Multiple Payments</h3>
              <p className="text-gray-600">Pay with UPI, Card, or Cash - your choice!</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/book-ride">
              <button className="bg-primary hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
                🚀 Book a Ride Now
              </button>
            </Link>

            <Link href="/my-bookings">
              <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-10 rounded-full text-lg shadow-lg border-2 border-gray-300 transform hover:scale-105 transition-all">
                📋 My Bookings
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600 font-medium">Rides Completed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">100kg</div>
              <div className="text-gray-600 font-medium">CO₂ Saved</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-accent mb-2">4.8★</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 CabBookingPro - Built with Next.js & Spring Boot</p>
          <p className="mt-2">Demonstrating OOP Concepts: Encapsulation, Inheritance, Polymorphism & Abstraction</p>
        </div>
      </footer>
    </div>
  )
}
