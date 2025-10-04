# Google Maps Integration Guide

## Overview

The booking page now features Google Maps integration with:

- **Location Autocomplete**: Automatically suggests addresses as you type
- **Interactive Map**: Visual route display with pickup and drop markers
- **Automatic Distance Calculation**: Computes the driving distance between locations
- **Route Visualization**: Shows the optimal driving route on the map

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
4. Go to "Credentials" and create an API key
5. (Optional but recommended) Restrict the API key:
   - Set application restrictions (HTTP referrer)
   - Set API restrictions to only the APIs listed above

### 2. Configure the API Key

1. Open `frontend/.env.local` file
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. Restart the Next.js development server:

```bash
cd frontend
npm run dev
```

## Features

### Location Autocomplete

- **Type to Search**: Start typing a location in the pickup or drop location fields
- **Suggestions**: Google Maps will show relevant location suggestions
- **Select**: Click on a suggestion to automatically fill the address and coordinates

### Automatic Distance Calculation

- **Auto-Calculate**: When both pickup and drop locations are selected, the system automatically:
  - Calculates the driving distance via Google Directions API
  - Updates the distance field
  - Computes the fare based on the calculated distance
- **Read-Only Distance**: The distance field becomes read-only when auto-calculated
- **Visual Confirmation**: A green checkmark appears when distance is auto-calculated

### Interactive Map

- **Toggle View**: Click "Show Map & Route" button to display/hide the map
- **Responsive**: Map is always visible on large screens, toggleable on mobile
- **Pickup Marker (A)**: Blue marker showing your pickup location
- **Drop Marker (B)**: Blue marker showing your drop-off location
- **Route Line**: Purple line showing the driving route between locations

### Route Information

When both locations are selected, the map displays:

- **Distance**: Total driving distance
- **Duration**: Estimated travel time
- **Route Preview**: Visual representation of the path

## User Workflow

1. **Login**: User must be logged in to access the booking page
2. **Enter Pickup**: Start typing pickup location, select from suggestions
3. **Enter Drop**: Start typing drop location, select from suggestions
4. **Auto-Calculate**: Distance and route are automatically calculated
5. **View Map**: (Optional) Toggle map to see visual route
6. **Select Options**: Choose eco-ride option if desired
7. **Select Payment**: Choose payment method (UPI/Card/Cash)
8. **Confirm Booking**: Submit the booking

## Technical Details

### Dependencies Installed

- `@react-google-maps/api`: React wrapper for Google Maps JavaScript API
- `@types/google.maps`: TypeScript type definitions

### New State Variables

- `mapLoaded`: Tracks if Google Maps script is loaded
- `showMap`: Controls map visibility (toggle)
- `directions`: Stores the calculated route data
- `pickupLat/pickupLng`: Pickup location coordinates
- `dropLat/dropLng`: Drop location coordinates

### Key Functions

#### `initAutocomplete()`

- Initializes Google Places Autocomplete on input fields
- Listens for place selection events
- Extracts coordinates and addresses
- Triggers route calculation

#### `calculateRoute()`

- Uses Google Directions Service
- Calculates driving route between two locations
- Extracts distance in kilometers
- Updates state with route data and distance
- Recalculates fare based on new distance

### Map Configuration

- **Default Center**: Delhi (28.6139, 77.2090)
- **Zoom Level**: 13
- **Country Restriction**: India (can be changed in code)
- **Map Controls**: Simplified (no street view, map type controls)

## Customization

### Change Country Restriction

Edit the `componentRestrictions` in both autocomplete initializations:

```typescript
componentRestrictions: { country: 'us' }, // For USA
componentRestrictions: { country: 'gb' }, // For UK
```

### Change Default Center

Update the `defaultCenter` constant:

```typescript
const defaultCenter = {
  lat: YOUR_LATITUDE,
  lng: YOUR_LONGITUDE,
};
```

### Modify Route Line Color

Change the `strokeColor` in `DirectionsRenderer` options:

```typescript
polylineOptions: {
  strokeColor: '#FF0000', // Red color
  strokeWeight: 5,
}
```

## Troubleshooting

### Map Not Loading

- ✅ Check if API key is correctly set in `.env.local`
- ✅ Ensure Next.js server was restarted after adding the API key
- ✅ Verify all required APIs are enabled in Google Cloud Console
- ✅ Check browser console for API key errors

### Autocomplete Not Working

- ✅ Ensure Places API is enabled
- ✅ Check if API key has proper HTTP referrer restrictions
- ✅ Verify the map script has loaded (check `mapLoaded` state)

### Distance Not Calculating

- ✅ Ensure Directions API is enabled
- ✅ Check if both locations have valid coordinates
- ✅ Verify network requests in browser dev tools
- ✅ Check console for error messages

### API Quota Exceeded

- Monitor your API usage in Google Cloud Console
- Set up billing alerts
- Consider implementing request caching
- Restrict API key to prevent unauthorized use

## Cost Considerations

Google Maps APIs have free tier quotas:

- **Maps JavaScript API**: $200 free credit/month
- **Places API**: $200 free credit/month
- **Directions API**: $200 free credit/month

Typical costs per 1000 requests:

- Maps JavaScript API: $7
- Places Autocomplete (per session): $2.83
- Directions API: $5

**Recommendation**: Set up billing alerts and monitor usage regularly.

## Testing

To test the integration:

1. Start the backend:

```bash
cd backend
java -jar target/cab-booking-system-1.0.0.jar
```

2. Start the frontend:

```bash
cd frontend
npm run dev
```

3. Navigate to the booking page: `http://localhost:3000/book-ride`

4. Test scenarios:
   - Type "Connaught Place, Delhi" in pickup
   - Type "India Gate, Delhi" in drop
   - Verify distance is calculated automatically
   - Check that map shows route
   - Confirm fare is updated based on distance

## Future Enhancements

Potential improvements:

- 📍 Current location detection (using browser geolocation)
- 🔍 Nearby cab availability display
- 🚦 Real-time traffic information
- 💰 Dynamic pricing based on traffic/demand
- 📱 Map-based location picker (click on map to select)
- 🗺️ Multiple route options
- 📊 Historical route data for better estimates

## Support

For issues or questions:

- Check the [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- Review [React Google Maps API Documentation](https://react-google-maps-api-docs.netlify.app/)
- Consult browser console for error messages
