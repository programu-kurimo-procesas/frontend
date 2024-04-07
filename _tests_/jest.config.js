module.exports = {
    // Other Jest configuration options you might have
    setupFiles: [
      './node_modules/jest-expo/index.js', // Required for Expo projects
    ],
    moduleNameMapper: {
      '^expo-fetch$': 'jest-expo/universal-fetch', // Maps expo-fetch to jest-expo's universal fetch
    },
  };