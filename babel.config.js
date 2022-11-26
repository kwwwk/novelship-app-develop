module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          app: './app',
          common: './common',
          assets: './assets',
          types: './types',
        },
      },
    ],
    'react-native-reanimated/plugin',
    'macros',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel', 'transform-remove-console'],
    },
  },
};
