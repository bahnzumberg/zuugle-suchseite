const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_DIR = path.resolve(__dirname, "build");

module.exports = {
	mode: "development",
	output: {
		path: BUILD_DIR,
		filename: "./app_static/[name].bundle.js",
		publicPath: "./public", // Added this line to set the publicPath
	},

	devServer: {
		static: BUILD_DIR,
		// directory: BUILD_DIR,
		// staticOptions: {
		//   setHeaders: (res, path) => {
		//     if (path.endsWith('.json')) {
		//       res.setHeader('Content-Type', 'application/javascript');
		//     }
		//   },
		// },
		// staticOptions: {
		//   setHeaders: (res, path) => {
		//     if (path.endsWith('.json')) {
		//       res.setHeader('Content-Type', 'text/html');
		//     }
		//   },
		// },

		compress: true,
		open: true,
		historyApiFallback: true,
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [["@babel/preset-env", { targets: "defaults" }]],
					},
				},
			},
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.(scss)$/,
				loader: "css-loader",
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ["@svgr/webpack", "url-loader"],
			},
			{
				test: /\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "./img/[name].[hash].[ext]",
							publicPath: "/", // Ensures the correct public path
						},
					},
				],
			},
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			template: "./public/index.html",
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "./public", to: "app_static" },
				{ from: "./src/icons/svg/provider", to: "app_static/icons/provider" },
			],
		}),
		new MiniCssExtractPlugin({
			filename: "./app_static/[name].styles.css",
			attributes: {},
		}),
		new webpack.DefinePlugin({
			"process.env.REACT_APP_API_URL": JSON.stringify("https://www2.zuugle.at/api"),
		}),
	],
};
