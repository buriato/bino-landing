const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
  ]
};

import('owl.carousel.min');
module.exports = config;