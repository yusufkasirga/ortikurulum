// Reads app.json and injects secrets from the build environment.
// GOOGLE_MAPS_API_KEY is needed for the map on Android builds (iOS uses Apple Maps).
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    ['react-native-maps', process.env.GOOGLE_MAPS_API_KEY ? { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY } : {}],
  ],
});
