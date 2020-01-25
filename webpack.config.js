const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/app.ts",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }
    ]
  },
  // import 文で .ts ファイルを解決するためa
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
  ]
};