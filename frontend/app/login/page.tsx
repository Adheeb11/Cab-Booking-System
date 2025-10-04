'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mockApi } from '@/lib/mockData'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userType, setUserType] = useState<'customer' | 'driver'>('customer')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: any) => {
    setError('')
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (userType === 'driver') {
        const response = await mockApi.driverLogin(formData.email, formData.password)
        
        if (response.driverId) {
          // Store driver data in localStorage
          localStorage.setItem('driver', JSON.stringify(response))
          localStorage.setItem('driverId', response.driverId.toString())
        
          // Redirect to driver dashboard
          router.push('/driver-dashboard')
        }
      } else {
        const response = await mockApi.login(formData.email, formData.password)
        
        if (response.userId) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(response))
          localStorage.setItem('userId', response.userId.toString())
        
          // Redirect to home
          router.push('/')
        }
      }
    } catch (error: any) {
      setError(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 justify-center">
            <span className="text-6xl">🚕</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* User Type Selector */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <div className="flex">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  userType === 'customer'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType('driver')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  userType === 'driver'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                🚗 Driver
              </button>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {userType === 'driver' ? '🚗 Driver Login' : '👤 Customer Login'}
            </h2>
            <p className="text-gray-600 mt-1">
              {userType === 'driver' ? 'Sign in to access your dashboard' : 'Sign in to your account'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600 text-xl">⚠️</span>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 {userType === 'driver' ? 'Driver License/Email' : 'Email Address'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={userType === 'driver' ? "driver@example.com" : "your.email@example.com"}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

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
              {loading ? '⏳ Signing In...' : '🚀 Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Login Help */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Demo Accounts</p>
              {userType === 'driver' ? (
                <>
                  <p className="text-xs text-blue-700">
                    Email: rajesh@driver.com | Password: driver123
                  </p>
                  <p className="text-xs text-blue-700">
                    Email: amit@driver.com | Password: driver123
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-blue-700">
                    Email: john@example.com | Password: password123
                  </p>
                  <p className="text-xs text-blue-700">
                    Email: jane@example.com | Password: password123
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
