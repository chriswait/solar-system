var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

require('babel-polyfill')

module.exports = (env, argv) => {
  let isDev = argv.mode === 'development'

  return {
    entry: {
      app: './src/index.js'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue: 'vue/dist/vue.common.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {},
            cssSourceMap: true
          }
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: ['node_modules'],
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: ['node_modules'],
          query: {
            presets: ['env'],
            plugins: ["transform-class-properties"]
          }
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'src/templates/index.html' }),
      new webpack.LoaderOptionsPlugin({ options: {} }), // currently required for eslint
    ],
    stats: {
      colors: true
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
      host: 'localhost',
      port: 8080,
      contentBase: './dist',
    },
    output: {
      path: path.resolve(__dirname, 'dist'), // eslint-disable-line no-undef
      filename: '[name].bundle.js'
    },
  }
}
