var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	debug: true,
	devtool: 'eval',

	context: __dirname + '/src',

	entry: {
		main: './scripts/main.js'
	},

	output: {
		path: __dirname + '/public/assets',
		filename: '[name].bundle.js',
		sourceMapFilename: '[name].map'
	},

	// uses libraries already loaded on page instead of bundling
	externals: {
		//'jquery': 'jQuery',
		//'backbone': 'Backbone',
		//'_': 'underscore',
	},

	module: {
		loaders: [
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader')
			},
			{
				test: /\.html$/,
				loader: 'ejs-loader'
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},

	resolve: {
		modulesDirectories: ['web_modules', 'node_modules', 'less'],
		extensions: ['', '.js', '.less']
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		//new webpack.optimize.CommonsChunkPlugin({
		//	name: 'common',
		//	minChunks: Infinity
		//}),
		new ExtractTextPlugin('[name].bundle.css', {
			allChunks: true
		}),
		new webpack.ProvidePlugin({
			//React: 'react'
			//Backbone: 'backbone',
			//_: 'underscore',
			//$: 'jquery'
		})
	]
};