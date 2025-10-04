'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Cab {
  cabId: number;
  cabNumber: string;
  cabType: string;
  seats: number;
  ratePerKm: number;
  isElectric: boolean;
  available: boolean;
  driver: { driverId: number; name: string; phone: string; rating: number };
}

export default function AdminCabs() {
  const router = useRouter();
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }
    fetchCabs();
  }, [router]);

  const fetchCabs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/cabs');
      const data = await response.json();
      setCabs(data);
    } catch (error) {
      console.error('Error fetching cabs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (cabId: number, available: boolean) => {
    try {
      await fetch(`http://localhost:8080/api/admin/cabs/${cabId}/availability?available=${!available}`, {
        method: 'PUT',
      });
      fetchCabs();
    } catch (error) {
      console.error('Error updating cab:', error);
    }
  };

  const deleteCab = async (cabId: number) => {
    if (!confirm('Are you sure you want to delete this cab?')) return;
    try {
      await fetch(`http://localhost:8080/api/admin/cabs/${cabId}`, {
        method: 'DELETE',
      });
      fetchCabs();
    } catch (error) {
      console.error('Error deleting cab:', error);
    }
  };

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
          <h1 className="text-3xl font-bold">Cab Fleet Management</h1>
          <p className="text-red-100 mt-1">Manage your entire cab fleet</p>
        </div>
      </header>

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link href="/admin/dashboard" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Dashboard</Link>
            <Link href="/admin/users" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Users</Link>
            <Link href="/admin/drivers" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Drivers</Link>
            <Link href="/admin/cabs" className="py-4 px-1 border-b-2 border-red-500 font-medium text-red-600 whitespace-nowrap">Cabs</Link>
            <Link href="/admin/bookings" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Bookings</Link>
            <Link href="/admin/payments" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Payments</Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cabs.map((cab) => (
            <div key={cab.cabId} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className={`h-2 ${cab.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{cab.cabNumber}</h3>
                    <p className="text-sm text-gray-600">{cab.cabType}</p>
                  </div>
                  {cab.isElectric && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">
                      ⚡ EV
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium text-gray-900">{cab.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium text-gray-900">₹{cab.ratePerKm}/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${cab.available ? 'text-green-600' : 'text-red-600'}`}>
                      {cab.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Driver Details</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">{cab.driver.name}</p>
                    <p className="text-sm text-gray-600">{cab.driver.phone}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">{cab.driver.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAvailability(cab.cabId, cab.available)}
                    className={`flex-1 px-4 py-2 rounded font-medium ${
                      cab.available
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {cab.available ? 'Mark Busy' : 'Mark Available'}
                  </button>
                  <button
                    onClick={() => deleteCab(cab.cabId)}
                    className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cabs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No cabs found</p>
          </div>
        )}
      </main>
    </div>
  );
}
