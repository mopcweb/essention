const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './client/src/index.js',
  devtool: 'inline-source-map',
  devServer: {
     contentBase: './client/public',
     proxy: {
      '/api': {
        target: 'http://localhost:5000',
        pathRewrite: {'^/api' : ''}
      }
    }
   },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './client/public')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/public/index.html'
    })
  ],
  module: {
     rules: [
       {
         test: /\.sass$/,
         use: [
           'style-loader',
           'css-loader',
           'sass-loader'
         ]
       },
       {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
     ]
   }
};
