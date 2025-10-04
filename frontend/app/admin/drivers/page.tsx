'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Driver {
  driverId: number;
  name: string;
  phone: string;
  licenseNumber: string;
  experience: number;
  rating: number;
}

export default function AdminDrivers() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }
    fetchDrivers();
  }, [router]);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/drivers');
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (driverId: number) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    try {
      await fetch(`http://localhost:8080/api/admin/drivers/${driverId}`, {
        method: 'DELETE',
      });
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
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
          <h1 className="text-3xl font-bold">Driver Management</h1>
          <p className="text-red-100 mt-1">Manage all registered drivers</p>
        </div>
      </header>

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link href="/admin/dashboard" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Dashboard</Link>
            <Link href="/admin/users" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Users</Link>
            <Link href="/admin/drivers" className="py-4 px-1 border-b-2 border-red-500 font-medium text-red-600 whitespace-nowrap">Drivers</Link>
            <Link href="/admin/cabs" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Cabs</Link>
            <Link href="/admin/bookings" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Bookings</Link>
            <Link href="/admin/payments" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Payments</Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.driverId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.driverId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{driver.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{driver.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{driver.licenseNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{driver.experience} years</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm text-gray-900">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => deleteDriver(driver.driverId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {drivers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No drivers found</p>
          </div>
        )}
      </main>
    </div>
  );
}
