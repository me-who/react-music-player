const webpack = require('webpack');
const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: [
		// 这里是你的入口文件
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
		'./app/index.js'
	],
	output:{
		path : path.resolve(__dirname , './dist'),
		filename:'bundle.js',
	},
	module: {
    resolve:{
        extensions:['','.js','.json']
    },
    loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query:
            {
              presets:['react','es2015']
            }
        },
        {
            test: /\.json?$/,
            loader: 'json'
        },
        {
            test: /\.css$/,
            loader: "style!css"
        },
        {
            test: /\.less/,
            loader: 'style-loader!css-loader!less-loader'
        }
      ]
    },
	/*热替换*/
	plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      filename: './index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
