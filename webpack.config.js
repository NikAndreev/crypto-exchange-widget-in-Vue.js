const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
	const configObj = {
		splitChunks: {
			chunks: 'all'
		},
		minimizer: [
			new OptimizeCssAssetWebpackPlugin({})
		],
	};
}
 
module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/template.min.js',
		publicPath: '/dist/'
	},
	devServer: {
		static: './',
		historyApiFallback: true,
		open: true,
		compress: true,
		hot: true,
		port: 3000,
	},
	module: {
		rules: [
		{
			test:/.(s*)css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                },
                'postcss-loader',
				'sass-loader',
			]
		},
		// {
		// 	test: /\.js$/,
		// 	use: ['babel-loader'],
		// 	exclude: /node_modules/,
		// },
		]
	},
	optimization: optimization(),
	devtool: isDev ? 'source-map' : false,
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: './css/template.min.css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{from: path.resolve(__dirname, 'src/vendor'), to: path.resolve(__dirname, 'dist/vendor')},
				{from: path.resolve(__dirname, 'src/img'), to: path.resolve(__dirname, 'dist/img')},
				// {from: path.resolve(__dirname, 'src/fonts'), to: path.resolve(__dirname, 'dist/fonts')}
			]
		}),
	]
};

