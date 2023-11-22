const webpack = require("webpack");
const { merge } = require("webpack-merge");

const base = require("./webpack.client.base");

const { getWebpackDefinePlugin } = require("./utils.js");

/** @type {import('webpack').Configuration} */
module.exports = () =>
  merge(base, {
    target: "web",
    mode: "development",
    devtool: "cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.(css|less)$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(scss)$/,
          use: [
            {
              loader: "style-loader",
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
          __DEV__: true,
          __PROD__: false,
          __TEST__: false,
        }),
      ),
    ],
    experiments: {
      outputModule: true,
    },
  });
