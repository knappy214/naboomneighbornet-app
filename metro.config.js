const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// UI Kitten Metro configuration for performance optimization
config.resolver.alias = {
  ...config.resolver.alias,
  '@eva-design/eva': '@eva-design/eva',
  '@ui-kitten/components': '@ui-kitten/components'
};

// Enable tree shaking for better performance
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;
