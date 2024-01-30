// Dependencies
const path = require("path");
const { execSync } = require("child_process");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const nodemon = require("nodemon");

// Webpack Configuration
const webpackClientConfig = require("../webpack/webpack.client.dev")();
const webpackServerConfig = require("../webpack/webpack.server")();

let clientAssetsInitialized = false;
let nodemonInitialized = false;

/** @type {import('webpack-dev-server').Configuration} */
const devServerOptions = {
  static: {
    directory: path.join(__dirname, "../dist/webapp/assets"),
  },
  host: "localhost",
  port: 3001,
  headers: { "Access-Control-Allow-Origin": "*" },
  devMiddleware: {
    writeToDisk: true,
  },
  hot: true,
  liveReload: false,
};

const nodeServerCompiler = webpack(webpackServerConfig);
const clientCompiler = webpack(webpackClientConfig);

clientCompiler.hooks.afterEmit.tap("clientAfterEmitPlugin", () => {
  console.info("[webpack] client assets emitted");
  if (!clientAssetsInitialized) {
    clientAssetsInitialized = true;
    nodeServerCompiler.hooks.afterEmit.tap("serverAfterEmitPlugin", () => {
      console.info("[webpack] server assets emitted");
      if (!nodemonInitialized) {
        nodemonInitialized = true;
        // Nodemon
        console.info("[nodemon] starting");
        nodemon({
          script: "dist/server",
          ext: "js json",
          watch: ["dist/server.js"],
        })
          .on("start", () => {
            console.info(
              `[nodemon] iniciado. Ahora iniciando el servidor web local en el puerto 3000`,
            );
          })
          .on("crash", () => {
            console.error("[nodemon] falló");
          });
      }
    });

    nodeServerCompiler.watch({}, (err, stats) => {
      if (err) {
        return console.error(err);
      }
      const statString = stats.toString();
      process.stdout.write(statString + "\n");
    });
  }
});

const devServer = new WebpackDevServer(devServerOptions, clientCompiler);

execSync("npm run clean");

devServer.startCallback((err) => {
  if (err) {
    console.error("[webpack] devServer listening falló");
    return console.error(err);
  }
  console.info(`[webpack] devServer listening en el puerto 3001`);
});
