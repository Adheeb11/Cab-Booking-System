# 🚀 OpenStreetMap Quick Start Guide

## Getting Started with FREE Mapping

Your Cab Booking System now uses **OpenStreetMap** - a 100% free, open-source mapping solution!

---

## ⚡ Quick Start

### 1. No Setup Required! ✅

Unlike Google Maps, you don't need:

- ❌ API Keys
- ❌ Billing Information
- ❌ Account Setup
- ❌ Credit Card

**Just run the application and it works!**

### 2. Start the Application

```bash
# Start Backend (Spring Boot)
cd backend
mvn spring-boot:run

# Start Frontend (Next.js)
cd frontend
npm run dev
```

### 3. Test the Booking Page

1. Open browser: http://localhost:3000/book-ride
2. Type in **Pickup Location** (min 3 characters)
3. Select location from dropdown
4. Type in **Drop Location**
5. Select location from dropdown
6. Watch the map display your route automatically! 🗺️

---

## 🎯 How to Use

### Location Search

**Type minimum 3 characters** to trigger search:

```
Examples:
- "Connaught Place, New Delhi"
- "India Gate"
- "Bangalore Airport"
- "Marine Drive, Mumbai"
```

**Features:**

- Autocomplete suggestions appear as you type
- Shows up to 5 best matches
- Search restricted to India (configurable)
- Loading spinner shows search in progress
- Green checkmark when location selected

### Map Interaction

**Markers:**

- 🟢 **Green Marker** = Pickup Location
- 🔴 **Red Marker** = Drop Location
- 🟣 **Purple Line** = Driving Route

**Automatic Features:**

- Map auto-zooms to show both locations
- Route calculated automatically
- Distance displayed in kilometers
- Fare calculated based on distance

---

## 🛠️ Configuration

### Change Search Country

Edit `frontend/app/book-ride/page.tsx`:

```typescript
// Current (India only)
countrycodes=in

// For USA
countrycodes=us

// For UK
countrycodes=gb

// For worldwide (remove parameter)
// Remove &countrycodes=in from URL
```

### Change Map Style

Edit `frontend/components/OSMMapComponent.tsx`:

```typescript
// Standard (Current)
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
/>

// Dark Theme
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
/>

// Light Theme
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
/>

// Satellite View (requires external service)
<TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution='&copy; Esri'
/>
```

### Adjust Search Sensitivity

Edit `frontend/app/book-ride/page.tsx`:

```typescript
// Current: Minimum 3 characters
if (query.length < 3) {
  // ...
}

// Change to 2 characters for faster search
if (query.length < 2) {
  // ...
}

// Change to 4 characters for more specific results
if (query.length < 4) {
  // ...
}
```

### Change Number of Suggestions

```typescript
// Current: Shows 5 suggestions
limit = 5;

// Show 10 suggestions
limit = 10;

// Show 3 suggestions
limit = 3;
```

---

## 📊 Free APIs Used

### 1. Nominatim (Location Search)

**Endpoint:**

```
https://nominatim.openstreetmap.org/search
```

**Parameters:**

- `format=json` - Response format
- `q={query}` - Search query
- `limit=5` - Max results
- `countrycodes=in` - Country restriction

**Rate Limits:**

- Fair use: 1 request per second
- No API key required
- Free forever

**Example Response:**

```json
[
  {
    "place_id": 123456,
    "lat": "28.6139",
    "lon": "77.2090",
    "display_name": "Connaught Place, New Delhi, India"
  }
]
```

### 2. OSRM (Route Calculation)

**Endpoint:**

```
https://router.project-osrm.org/route/v1/driving/{coordinates}
```

**Parameters:**

- `overview=full` - Full route geometry
- `geometries=geojson` - GeoJSON format

**Rate Limits:**

- Fair use policy
- No API key required
- Free forever

**Example Response:**

```json
{
  "code": "Ok",
  "routes": [{
    "distance": 5234.5,
    "duration": 842.1,
    "geometry": {
      "coordinates": [[77.2090, 28.6139], ...]
    }
  }]
}
```

### 3. OpenStreetMap Tiles (Map Display)

**Endpoint:**

```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

**Features:**

- No API key
- Free to use
- Community maintained
- Updated regularly

---

## 🔧 Troubleshooting

### Issue 1: No Suggestions Appearing

**Solution:**

1. Check you typed at least 3 characters
2. Verify internet connection
3. Check browser console for errors
4. Try different search terms

### Issue 2: "Too Many Requests" Error

**Problem:** Nominatim rate limit (1 req/sec)

**Solution:** Add debouncing:

```typescript
// Add this helper function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Use it
const debouncedSearch = debounce(searchLocation, 500)

// Call in onChange
onChange={(e) => {
  setBookingData(prev => ({ ...prev, pickupLocation: e.target.value }))
  debouncedSearch(e.target.value, true)
}}
```

### Issue 3: Map Not Loading

**Problem:** Server-side rendering (SSR) conflict

**Solution:** Already fixed with dynamic import:

```typescript
const MapComponent = dynamic(() => import("@/components/OSMMapComponent"), {
  ssr: false, // Critical!
});
```

### Issue 4: Marker Icons Not Showing

**Problem:** CDN URLs not loading

**Solution:** Check `OSMMapComponent.tsx` has correct URLs:

```typescript
iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
```

### Issue 5: Route Not Calculating

**Checklist:**

- [ ] Both locations have valid coordinates
- [ ] Internet connection active
- [ ] OSRM server accessible
- [ ] Check browser console for errors

**Test OSRM directly:**

```bash
curl "https://router.project-osrm.org/route/v1/driving/77.2090,28.6139;77.2295,28.6358?overview=full"
```

---

## 🎓 Best Practices

### 1. Implement Debouncing

Avoid rate limits by waiting for user to stop typing:

```typescript
let searchTimeout: NodeJS.Timeout;

const handleSearchInput = (value: string, isPickup: boolean) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchLocation(value, isPickup);
  }, 500);
};
```

### 2. Cache Recent Searches

Store recent searches in localStorage:

```typescript
const saveRecentSearch = (location: string) => {
  const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
  recent.unshift(location);
  localStorage.setItem("recentSearches", JSON.stringify(recent.slice(0, 5)));
};
```

### 3. Add Error Handling

Handle API failures gracefully:

```typescript
try {
  const response = await fetch(nominatimUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  // Process data
} catch (error) {
  console.error("Search failed:", error);
  alert("Location search unavailable. Please try again.");
}
```

### 4. Show Loading States

Improve UX with spinners:

```typescript
{
  isSearching && (
    <div className="absolute right-3 top-3">
      <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
    </div>
  );
}
```

---

## 🚀 Advanced Features

### Add Current Location

```typescript
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get address
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();

        setBookingData((prev) => ({
          ...prev,
          pickupLocation: data.display_name,
          pickupLat: latitude,
          pickupLng: longitude,
        }));
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location");
      }
    );
  }
};

// Add button
<button onClick={getCurrentLocation}>📍 Use Current Location</button>;
```

### Map Click to Select Location

```typescript
// In OSMMapComponent.tsx
import { useMapEvents } from "react-leaflet";

function LocationMarker({ onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Add to map
<LocationMarker onLocationSelect={handleMapClick} />;
```

### Add Favorite Locations

```typescript
interface FavoriteLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const favorites: FavoriteLocation[] = [
  { name: "Home", address: "...", lat: 28.6, lng: 77.2 },
  { name: "Office", address: "...", lat: 28.7, lng: 77.3 },
];

// Show in UI
{
  favorites.map((fav) => (
    <button onClick={() => selectFavorite(fav)}>⭐ {fav.name}</button>
  ));
}
```

---

## 📚 Additional Resources

### Official Documentation

- **OpenStreetMap**: https://www.openstreetmap.org
- **Nominatim API**: https://nominatim.org/release-docs/latest/
- **OSRM API**: http://project-osrm.org/docs/v5.24.0/api/
- **Leaflet**: https://leafletjs.com/reference.html
- **React-Leaflet**: https://react-leaflet.js.org/

### Tutorials

- Leaflet Quick Start: https://leafletjs.com/examples/quick-start/
- OSM Beginners Guide: https://wiki.openstreetmap.org/wiki/Beginners%27_guide
- Nominatim Usage: https://operations.osmfoundation.org/policies/nominatim/

### Community

- OSM Forum: https://community.openstreetmap.org/
- Leaflet GitHub: https://github.com/Leaflet/Leaflet
- Stack Overflow: Tag [leaflet] [openstreetmap]

### Alternative Tile Providers

- **Mapbox** (limited free): https://www.mapbox.com/
- **Thunderforest**: https://www.thunderforest.com/
- **CartoDB**: https://carto.com/basemaps/
- **Stamen**: http://maps.stamen.com/

---

## ✅ Migration Checklist

From the migration, you should have:

- [x] Uninstalled Google Maps packages
- [x] Installed Leaflet packages (react-leaflet, leaflet, leaflet-routing-machine)
- [x] Created OSMMapComponent with custom markers
- [x] Updated booking page with Nominatim search
- [x] Implemented OSRM routing
- [x] Removed API key requirements
- [x] Tested location search
- [x] Tested route calculation
- [x] Tested map display

**Everything is free and working!** 🎉

---

## 💰 Cost Comparison

| Feature           | Google Maps   | OpenStreetMap |
| ----------------- | ------------- | ------------- |
| **Monthly Cost**  | $50-100+      | **$0**        |
| **Setup Time**    | 15 minutes    | **0 minutes** |
| **API Key**       | Required      | **None**      |
| **Billing Info**  | Required      | **None**      |
| **Rate Limits**   | Strict quotas | Fair use      |
| **Privacy**       | Tracked       | Better        |
| **Customization** | Limited       | **Unlimited** |

**Annual Savings: $600-1200+** 💸

---

## 🎉 You're Ready!

Your cab booking system is now powered by 100% free, open-source mapping!

**Key Advantages:**

- ✅ No API keys needed
- ✅ No billing setup
- ✅ No usage limits (fair use)
- ✅ No costs ever
- ✅ Full customization
- ✅ Privacy-friendly
- ✅ Community-driven

**Start building amazing location-based features today!** 🚀🗺️

---

**Happy Mapping with OpenStreetMap!** 🌍
