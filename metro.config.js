const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// UI Kitten Metro configuration for performance optimization
config.resolver.alias = {
  ...config.resolver.alias,
  '@eva-design/eva': '@eva-design/eva',
  '@ui-kitten/components': '@ui-kitten/components',
  '@ui-kitten/eva-icons': '@ui-kitten/eva-icons',
};

// Enable tree shaking for better performance
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Fix source map generation issues
config.transformer.enableBabelRCLookup = false;
config.transformer.enableBabelRuntime = false;

// Disable source maps in development to avoid symbolication errors
if (process.env.NODE_ENV === 'development') {
  config.transformer.minifierConfig = {
    ...config.transformer.minifierConfig,
    sourceMap: false,
  };
}

module.exports = config;
