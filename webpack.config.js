const path = require('path');

const config = {
  mode: 'development',
  target: 'web',
  entry: './src/image-to-colors.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'image-to-colors.js',
    path: path.resolve(__dirname, './dist'),
    library: 'ImageToColors',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
};

module.exports = config;
