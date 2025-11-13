# Mapbox Integration Guide

This guide explains how Mapbox has been integrated into the Abrid application to replace Google Maps.

## Configuration

The Mapbox configuration is located in `src/config/mapbox.ts`:

```typescript
export const MAPBOX_CONFIG = {
  accessToken: 'pk.eyJ1IjoiYW1pbmVrZXJrIiwiYSI6ImNtaGFoaWY2ajFlbG0yaXM2YTkya2E5dWYifQ.rhsr3mr5ai5AXjmr-uphaQ',
  style: 'mapbox://styles/mapbox/streets-v12',
  language: 'ar',
  region: 'DZ', // Algeria
};
```

## Components

### MapboxMap Component

The core Mapbox component is located at `src/components/map/MapboxMap.tsx`. This is a reusable component that can be used throughout the application.

### Map Pages

1. **Drivers Map**: `src/pages/DriversMapMapbox.tsx`
2. **Trip Tracking**: `src/pages/TripTrackingMapbox.tsx`
3. **Map Demo**: `src/pages/MapDemoMapbox.tsx`

### Map Components

1. **Driver Map**: `src/components/driver/DriverMapMapbox.tsx`
2. **Passenger Map**: `src/components/passenger/PassengerMapMapbox.tsx`

## Routes

The following routes have been added to `App.tsx`:

- `/drivers-map-mapbox` - Drivers map view
- `/trip-tracking-mapbox` - Trip tracking view
- `/driver-map-mapbox` - Driver map component
- `/passenger-map-mapbox` - Passenger map component
- `/map-demo-mapbox` - Map demo page

## Features

- Real-time GPS tracking
- Custom markers for drivers and passengers
- Interactive popups with detailed information
- Responsive design
- RTL language support for Arabic
- Map controls (zoom, navigation, fullscreen)
- Automatic map centering on location updates

## Migration from Google Maps

All Google Maps dependencies have been removed from `package.json`:

- Removed `@googlemaps/js-api-loader`
- Removed `@react-google-maps/api`
- Removed `@types/google.maps`

## Usage

To use Mapbox in your components:

```typescript
import MapboxMap from '@/components/map/MapboxMap';

<MapboxMap
  center={{ lat: 32.4913, lng: 3.6745 }}
  zoom={12}
  markers={markers}
  showControls={true}
  className="w-full h-full"
/>
```

## Customization

### Marker Icons

Marker icons can be customized in `src/config/mapbox.ts`:

```typescript
export const MARKER_ICONS = {
  driver: {
    color: '#10b981', // green-500
    size: 'medium',
  },
  passenger: {
    color: '#3b82f6', // blue-500
    size: 'medium',
  },
  pickup: {
    color: '#f59e0b', // amber-500
    size: 'small',
  },
  destination: {
    color: '#ef4444', // red-500
    size: 'small',
  },
};
```

### Map Styles

The map style can be changed by modifying the `style` property in `MAPBOX_CONFIG`.

## Testing

To test the Mapbox integration:

1. Visit `/map-demo-mapbox` to see the demo page
2. Visit `/drivers-map-mapbox` to see the drivers map
3. Visit `/trip-tracking-mapbox?bookingId=1` to see trip tracking

## Troubleshooting

If maps are not loading:

1. Check that the Mapbox access token is valid
2. Ensure you have internet connectivity
3. Verify that there are no ad blockers interfering with map loading
4. Check the browser console for any error messages