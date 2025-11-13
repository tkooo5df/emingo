# How to View the Map Functionality

## Accessing the Map Demo

You can view the map functionality by navigating to the Map Demo page in your browser:

**URL:** http://localhost:5173/map-demo

This page demonstrates both driver and passenger map views with the following features:

## Driver Map Features

1. **GPS Tracking**: Real-time location tracking for drivers
2. **Passenger Pickup Points**: Shows nearby passengers waiting for pickup
3. **Route Navigation**: Displays navigation routes to passenger pickup locations
4. **Live Updates**: Driver location updates every 5 seconds

## Passenger Map Features

1. **Live Driver Tracking**: Shows the assigned driver's real-time location
2. **Pickup & Destination Markers**: Displays both pickup and destination points
3. **Distance & ETA Calculation**: Shows distance to driver and estimated arrival time
4. **Trip Route Visualization**: Displays the planned route for the trip

## How to Use the Map Demo

### For Driver View:
1. Click on the "Driver Map" tab
2. Click "Start Tracking" to enable GPS tracking
3. Allow location permissions in your browser
4. View nearby passenger pickup points on the map
5. Select a passenger to see route navigation

### For Passenger View:
1. Click on the "Passenger Map" tab
2. View the assigned driver's live location
3. See pickup and destination markers
4. Track distance and estimated arrival time
5. Monitor driver speed and connection status

## Technical Details

The map implementation uses:
- **OpenStreetMap** for map tiles (no API key required)
- **Leaflet.js** and **react-leaflet** for map components
- **Leaflet Routing Machine** for route navigation
- **Supabase Realtime** for live location updates
- **Custom Icons** for drivers, passengers, pickup, and destination points

## Troubleshooting

If the map doesn't load:
1. Make sure you're accessing http://localhost:5173/map-demo
2. Check that your browser allows location permissions
3. Ensure the development server is running (`npm run dev`)
4. Verify you have internet connectivity for loading map tiles

Note: Full functionality requires the Supabase database to be properly configured and accessible.