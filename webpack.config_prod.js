const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const BUILD_DIR = path.resolve(__dirname, "build");

module.exports = {
  mode: "production",
  output: {
    path: BUILD_DIR,
    filename: "./app_static/[name].bundle.js",
    publicPath: "/",
    clean: true,
  },
  watch: true,
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  devServer: {
    contentBase: BUILD_DIR,
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      // Korrekte Regel für CSS mit style-loader
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // Korrekte Regel für SVG-Dateien als React-Komponenten
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "file-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "./img/[name].[hash].[ext]",
              publicPath: "/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["*.LICENSE.txt"],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      filename: "index.html",
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./public", to: "app_static" },
        { from: "./src/icons/svg/provider", to: "app_static/icons/provider" },
        { from: "./src/icons/svg", to: "app_static/icons" },
      ],
    }),
    // MiniCssExtractPlugin ist jetzt entfernt
    new webpack.DefinePlugin({}),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: true,
    }),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap("DonePlugin", () => {
          console.log("Compile is done !");
          setTimeout(() => {
            process.exit(0);
          });
        });
      },
    },
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react-vendors",
          chunks: "all",
          priority: 30, // Erhöhte Priorität
          enforce: true,
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: "mui",
          chunks: "all",
          priority: 20, // Mittlere Priorität für MUI
          enforce: true,
        },
        leaflet: {
          test: /[\\/]node_modules[\\/](leaflet|react-leaflet|react-leaflet-cluster|leaflet.markercluster|leaflet-src)[\\/]/,
          name: "leaflet",
          chunks: "all",
          priority: 20, // Mittlere Priorität für Leaflet
          enforce: true,
        },
        i18n: {
          test: /[\\/]node_modules[\\/](i18next|react-i18next|i18next-http-backend|i18next-browser-languagedetector)[\\/]/,
          name: "i18n",
          chunks: "all",
          priority: 20, // Mittlere Priorität für i18n
          enforce: true,
        },
        redux: {
          test: /[\\/]node_modules[\\/](redux|@reduxjs)[\\/]/,
          name: "redux",
          chunks: "all",
          priority: 20, // Mittlere Priorität für Redux
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            // drop_console: true,
          },
        },
      }),
    ],
  },
};
