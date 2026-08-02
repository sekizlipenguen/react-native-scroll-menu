const path = require('path');

const exampleNodeModules = path.resolve(__dirname, 'node_modules');

module.exports = {
  preset: 'react-native',
  moduleDirectories: ['node_modules', exampleNodeModules],
  moduleNameMapper: {
    '^@sekizlipenguen/react-native-scroll-menu$': path.resolve(
      __dirname,
      '..',
      'index.js',
    ),
    '^react$': path.resolve(exampleNodeModules, 'react'),
    '^react/(.*)$': path.resolve(exampleNodeModules, 'react/$1'),
    '^react-native$': path.resolve(exampleNodeModules, 'react-native'),
    '^react-native/(.*)$': path.resolve(exampleNodeModules, 'react-native/$1'),
  },
};
