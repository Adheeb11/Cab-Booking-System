import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons for pickup and drop
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const dropIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface OSMMapComponentProps {
  pickupLat: number
  pickupLng: number
  dropLat: number
  dropLng: number
  routeData: any
  center: [number, number]
}

// Component to update map view
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

// Component to fit bounds when route is available
function FitBounds({ pickupLat, pickupLng, dropLat, dropLng }: { pickupLat: number, pickupLng: number, dropLat: number, dropLng: number }) {
  const map = useMap()
  useEffect(() => {
    if (pickupLat && pickupLng && dropLat && dropLng) {
      const bounds = L.latLngBounds(
        [pickupLat, pickupLng],
        [dropLat, dropLng]
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [pickupLat, pickupLng, dropLat, dropLng, map])
  return null
}

const OSMMapComponent: React.FC<OSMMapComponentProps> = ({
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
  routeData,
  center
}) => {
  const hasPickup = pickupLat !== 0 && pickupLng !== 0
  const hasDrop = dropLat !== 0 && dropLng !== 0
  const hasRoute = routeData && routeData.geometry

  // Convert route geometry to Leaflet format
  const routeCoordinates = hasRoute
    ? routeData.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])
    : []

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={hasPickup ? [pickupLat, pickupLng] : center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasPickup && hasDrop && <FitBounds pickupLat={pickupLat} pickupLng={pickupLng} dropLat={dropLat} dropLng={dropLng} />}

        {hasPickup && (
          <Marker position={[pickupLat, pickupLng]} icon={pickupIcon}>
            <Popup>
              <strong>Pickup Location</strong>
            </Popup>
          </Marker>
        )}

        {hasDrop && (
          <Marker position={[dropLat, dropLng]} icon={dropIcon}>
            <Popup>
              <strong>Drop Location</strong>
            </Popup>
          </Marker>
        )}

        {hasRoute && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color: '#4F46E5', weight: 5, opacity: 0.7 }}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default OSMMapComponent
