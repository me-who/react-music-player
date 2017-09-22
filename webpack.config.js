const webpack = require('webpack');
const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry :[
		// 这里是你的入口文件
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
		/*html-webpack-plugin插件*/
		new HtmlWebpackPlugin({
			template: './index.html',
			inject :'body',
			filename:'./index.html'
		}),
		new webpack.HotModuleReplacementPlugin(),
	]
}
