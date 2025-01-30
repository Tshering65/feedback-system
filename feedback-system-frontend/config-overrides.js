const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    };
    return config;
  },
};
