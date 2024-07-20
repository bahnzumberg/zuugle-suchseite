const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'build');
// const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = {
	mode: 'production',
	output: {
		path: BUILD_DIR,
		filename: './app_static/[name].bundle.js',
	},
	watch: true,
	devServer: {
		contentBase: BUILD_DIR,
		//   port: 9001,
		compress: true,
		hot: false,
		open: true,
		historyApiFallback: true,
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', { targets: 'defaults' }]],
					},
				},
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
			},
			{
				test: /\.(scss)$/,
				loader: 'css-loader',
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack', 'url-loader'],
			},
			{
				test: /\.(png|jpg|jpeg|gif|ico)$/,
				use: [
					{
						// loader: 'url-loader'
						loader: 'file-loader',
						options: {
							name: './img/[name].[hash].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			filename: 'index.html',
			template: './public/index.html',
		}),
		new HtmlWebpackPlugin({
			inject: true,
			filename: 'index-si.html',
			template: './public/index-si.html',
		}),
		new HtmlWebpackPlugin({
			inject: true,
			filename: 'index-de.html',
			template: './public/index-de.html',
		}),
		new HtmlWebpackPlugin({
			inject: true,
			filename: 'index-fr.html',
			template: './public/index-fr.html',
		}),
		new HtmlWebpackPlugin({
			inject: true,
			filename: 'index-ch.html',
			template: './public/index-ch.html',
		}),
		new HtmlWebpackPlugin({
			inject: true,
			filename: 'index-it.html',
			template: './public/index-it.html',
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: './public', to: 'app_static' }],
		}),
		new MiniCssExtractPlugin({
			filename: './app_static/[name].styles.css',
			attributes: {},
		}),
		new webpack.DefinePlugin({}),
		{
			apply: (compiler) => {
				compiler.hooks.done.tap('DonePlugin', (stats) => {
					console.log('Compile is done !');
					setTimeout(() => {
						process.exit(0);
					});
				});
			},
		},
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: 'all',
				parallel: true,
			}),
		],
	},
};
