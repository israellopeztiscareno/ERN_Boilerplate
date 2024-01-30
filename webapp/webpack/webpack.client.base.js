// Dependencies
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const scriptExtensions = /\.(tsx|ts|js|jsx|mjs)$/;
const imageExtensions = /\.(bmp|gif|jpg|jpeg|png)$/;
const fontsExtension = /\.(eot|otf|ttf|woff|woff2)$/;

/** @type {import('webpack').Configuration} */
module.exports = {
  target: "web",
  entry: {
    main: ["./src/webapp/index.tsx"],
  },
  output: {
    path: path.join(__dirname, "..", "dist/webapp/assets/static"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[id].[chunkhash].js",
    publicPath: "/static/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: scriptExtensions,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { loose: false }],
            ],
          },
        },
      },
      {
        test: fontsExtension,
        type: "asset",
      },
      {
        test: /\.svg/,
        type: "asset/inline",
      },
      {
        test: imageExtensions,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      templateParameters: {
        title: "InterWare de México",
      },
    }),
    new AssetsPlugin({
      removeFullPathAutoPrefix: true,
      path: path.join(__dirname, "..", "dist"),
      filename: "assets.json",
      fileTypes: ["js", "css"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./public",
          to: "./",
          globOptions: {
            ignore: [
              // Ignore all `html` files
              "**/*.html",
            ],
          },
        },
      ],
    }),
  ],
};
