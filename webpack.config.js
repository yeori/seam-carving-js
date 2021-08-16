const path = require('path')
const CssExtrator = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  entry: [path.resolve(__dirname, 'src/index.js')],
  output: {
    filename: 'seamcarving.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'seamcarving',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    injectClient: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [CssExtrator.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new CssExtrator({
      filename: 'seamcarving.css'
    })
  ]
}
