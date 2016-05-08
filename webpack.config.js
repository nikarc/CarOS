module.exports = {
  entry: __dirname + '/app/app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/public',
    publicPath: 'http://localhost:8080/public/'
  },
  devTool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: [ 'es2015', 'react' ]
        }
      },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif|otf)$/, loader: 'url-loader?limit=100000' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
};
