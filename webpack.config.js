var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  devtool: 'source-map',

  entry: {
    'index': './src/index.jsx',
    'vendor': [
      'classnames',
      'd3',
      'lodash',
      '@visnup/mapbox-gl/dist/mapbox-gl.css',
      '@visnup/mapbox-gl/dist/mapbox-gl.js',
      'moment',
      'react',
      'react-dom'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: process.env.NODE_ENV ?
      '[name]-[chunkhash].js' : '[name].js',
    sourceMapFilename: '[file].map.json'
  },

  module: {
    loaders: [
      { test: /\.csv$/, loader: 'dsv' },
      { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },

      { test: /\.jsx?$/,
        loader: 'react-hot',
        exclude: /node_modules|mapbox-gl/
      },
      { test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-1']
        },
        exclude: /node_modules|mapbox-gl/
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  postcss: function(webpack) { return [
    require('postcss-import')({ addDependencyTo: webpack }),
    require('postcss-nested'),
    require('postcss-custom-properties'),
    require('autoprefixer')
  ] },

  plugins: [
    new HtmlWebpackPlugin({ title: 'Opendoor Insights' }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: process.env.NODE_ENV ?
        '[name]-[chunkhash].js' : '[name].js'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en$/),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],

  devServer: {
    contentBase: 'public',
    proxy: {
      '*': {
        target: 'http://localhost:8000',
        bypass: function(req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }

};
