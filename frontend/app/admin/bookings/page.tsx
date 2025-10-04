'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  bookingId: number;
  pickupLocation: string;
  dropLocation: string;
  distance: number;
  fare: number;
  status: string;
  bookingDate: string;
  isEcoFriendly: boolean;
  carbonSaved: number;
  user: { userId: number; name: string; email: string };
  cab: { cabId: number; cabNumber: string; cabType: string };
  driver: { driverId: number; name: string; phone: string };
}

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: number, status: string) => {
    try {
      await fetch(`http://localhost:8080/api/admin/bookings/${bookingId}/status?status=${status}`, {
        method: 'PUT',
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-red-100 mt-1">Monitor and manage all bookings</p>
        </div>
      </header>

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link href="/admin/dashboard" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Dashboard</Link>
            <Link href="/admin/users" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Users</Link>
            <Link href="/admin/drivers" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Drivers</Link>
            <Link href="/admin/cabs" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Cabs</Link>
            <Link href="/admin/bookings" className="py-4 px-1 border-b-2 border-red-500 font-medium text-red-600 whitespace-nowrap">Bookings</Link>
            <Link href="/admin/payments" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Payments</Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-4">
          {['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === status
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Booking #{booking.bookingId}</h3>
                  <p className="text-sm text-gray-500">{new Date(booking.bookingDate).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    booking.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                  {booking.isEcoFriendly && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                      🌱 Eco
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">User</p>
                  <p className="text-gray-900">{booking.user.name}</p>
                  <p className="text-sm text-gray-500">{booking.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Driver</p>
                  <p className="text-gray-900">{booking.driver.name}</p>
                  <p className="text-sm text-gray-500">{booking.driver.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cab</p>
                  <p className="text-gray-900">{booking.cab.cabNumber}</p>
                  <p className="text-sm text-gray-500">{booking.cab.cabType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-xs text-gray-600">Pickup</p>
                  <p className="text-sm font-medium text-gray-900">{booking.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Drop</p>
                  <p className="text-sm font-medium text-gray-900">{booking.dropLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Distance</p>
                  <p className="text-sm font-medium text-gray-900">{booking.distance} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Fare</p>
                  <p className="text-sm font-medium text-gray-900">₹{booking.fare.toFixed(2)}</p>
                </div>
              </div>

              {booking.isEcoFriendly && (
                <div className="mb-4 p-3 bg-emerald-50 rounded border border-emerald-200">
                  <p className="text-sm text-emerald-800">
                    🌱 Carbon Saved: <span className="font-bold">{booking.carbonSaved.toFixed(2)} kg CO₂</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                  <>
                    <button
                      onClick={() => updateStatus(booking.bookingId, 'IN_PROGRESS')}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => updateStatus(booking.bookingId, 'COMPLETED')}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateStatus(booking.bookingId, 'CANCELLED')}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </main>
    </div>
  );
}
