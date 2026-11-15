// Reads app.json and injects build-time settings.
// GOOGLE_MAPS_API_KEY: Google Maps on Android. Without it Android falls back to an OpenStreetMap view.
// EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY: switch the app from demo data to the live backend.
module.exports = ({ config }) => ({
  ...config,
  extra: { ...(config.extra || {}), hasMapsKey: !!process.env.GOOGLE_MAPS_API_KEY },
  plugins: [
    ...(config.plugins || []),
    ['react-native-maps', process.env.GOOGLE_MAPS_API_KEY ? { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY } : {}],
  ],
});
