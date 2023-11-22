// Dependencies
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const base = require("./webpack.client.base");

const { getWebpackDefinePlugin } = require("./utils.js");

/** @type {import('webpack').Configuration} */
module.exports = () =>
  merge(base, {
    target: "web",
    mode: "production",
    devtool: "hidden-cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.(css|less)$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: () => [require("autoprefixer")],
                },
              },
            },
            {
              loader: "sass-loader",
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
          __DEV__: false,
          __PROD__: true,
          __TEST__: false,
        }),
      ),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].[chunkhash].css",
      }),
      new CompressionPlugin(),
    ],
    // optimization: {
    //   runtimeChunk: true, // creates a runtime file to be shared for all generated chunks.
    //   splitChunks: {
    //     chunks: "all", // This indicates which chunks will be selected for optimization.
    //     automaticNameDelimiter: "-",
    //     cacheGroups: {
    //       vendor: {
    //         // to convert long vendor generated large name into vendor.js
    //         test: /[\\/]node_modules[\\/]/,
    //         name: "vendor",
    //         chunks: "all",
    //       },
    //     },
    //   },
    //   minimize: false,
    //   minimizer: [],
    // },
    experiments: {
      outputModule: false,
    },
  });
