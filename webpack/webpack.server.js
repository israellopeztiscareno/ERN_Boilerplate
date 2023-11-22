// Dependencies
const path = require("path");
const webpack = require("webpack");
const webpackNodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");

const { getWebpackDefinePlugin } = require("./utils.js");

const imageExtensions = /\.(bmp|gif|jpg|jpeg|png)$/;
const fontsExtension = /\.(eot|otf|ttf|woff|woff2)$/;

/** @type {import('webpack').Configuration} */
module.exports = (env = {}) => {
  const __PRODUCTION__ = !!env.production;

  return {
    target: "node",
    mode: __PRODUCTION__ ? "production" : "development",
    name: "server",
    externalsPresets: { node: true },
    externals: [webpackNodeExternals()],
    entry: {
      server: "./src/server/index.ts",
    },
    output: {
      path: path.resolve(__dirname, "../", "dist"),
      filename: "[name].js",
      libraryTarget: "commonjs",
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/],
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: { node: "current" } }],
                ["@babel/preset-react"],
                ["@babel/preset-typescript"],
              ],
            },
          },
        },
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: [
            /node_modules/,
            path.resolve(__dirname, "..", "src/store/index.ts"),
          ],
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
        {
          test: /\.scss$/,
          use: [
            {
              loader: "ignore-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(
        getWebpackDefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEV__: !__PRODUCTION__,
          __PROD__: __PRODUCTION__,
          __TEST__: false,
        }),
      ),
      new CopyPlugin({
        patterns: [{ from: "./src/server/views", to: "./views" }],
      }),
    ],
  };
};
