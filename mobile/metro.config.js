const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add support for .mjs files for lucide-react-native and other modern packages
config.resolver.sourceExts.push('mjs');

module.exports = withNativeWind(config, { input: './global.css' });
