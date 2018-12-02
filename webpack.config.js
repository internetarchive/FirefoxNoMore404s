var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'src/scripts'),
    filename: 'build.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'lodash',
      d3: 'd3',
      wb: 'radial-tree'
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map',
  mode: 'production',
};
