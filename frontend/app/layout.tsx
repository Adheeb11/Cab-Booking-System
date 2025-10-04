import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cab Booking System',
  description: 'Book your ride with eco-friendly options',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
