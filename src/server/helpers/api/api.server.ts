// Dependencias
import http from "http";
import https from "https";
import winston from "winston";

import type { OutgoingHttpHeaders, RequestOptions } from "http";

import { createLoggerConfig } from "../../helpers/logger";

const REQUEST_API = "API";

winston.loggers.add(REQUEST_API, createLoggerConfig(REQUEST_API));
const requestAPILogger = winston.loggers.get(REQUEST_API);

function isHTML(text) {
  const value = text.toString();

  const htmlObjVal = "{";
  const htmlArrVal = "[";
  if (
    value === "null" ||
    value === "Error" ||
    value === "Not Found" ||
    (value.charAt(0) !== htmlObjVal && value.charAt(0) !== htmlArrVal)
  ) {
    return 1;
  }
  return 0;
}

interface Props {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  hostname: string;
  port: number;
  protocol: "http:" | "https:";
  path: string;
  headers?: OutgoingHttpHeaders;
  data?: any;
}

const HTTPService = async ({
  method,
  hostname,
  port,
  protocol,
  path,
  headers,
  data = {},
}: Props) => {
  const options: RequestOptions = {
    method,
    hostname,
    port,
    path,
    headers,
  };

  let link;

  if (protocol === "https:") {
    link = https;
  } else {
    link = http;
  }

  requestAPILogger.info(`[OPTIONS]: ${JSON.stringify(options)}`);

  requestAPILogger.info(`[BODY]: ${JSON.stringify(data)}`);

  return new Promise((resolve, reject) => {
    const req: http.ClientRequest = link.request(
      {
        ...options,
        requestCert: true,
        rejectUnauthorized: false,
      },
      (res: http.IncomingMessage) => {
        res.setEncoding("utf8");
        let responseString = [];

        res.on("data", (chunk) => {
          responseString.push(chunk);
        });

        res.on("end", () => {
          if (!path.includes("documents/download")) {
            requestAPILogger.info(
              `[RESPONSE]: ${res.statusCode} - ${responseString}`,
            );
          }

          if (isHTML(responseString) && res.statusCode > 300) {
            const responseError = {
              error: "Servicio temporalmente no disponible",
              error_message: "Servicio temporalmente no disponible: isHTML",
            };

            reject({
              status: res.statusCode,
              error: JSON.stringify(responseError),
            });
          } else if (responseString === undefined && res.statusCode > 300) {
            const responseError = {
              error: "Servicio temporalmente no disponible",
              error_message:
                "Servicio temporalmente no disponible: Response undefined",
            };

            reject({
              status: res.statusCode || 500,
              error: JSON.stringify(responseError),
            });
          } else if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              status: res.statusCode,
              response: responseString,
              headers: res.headers,
            });
          } else {
            reject({ status: res.statusCode, error: responseString });
          }
        });

        res.on("error", (e: Error) => {
          requestAPILogger.error(`[ERROR - res]: ${e.message}`);
          reject(e);
        });
      },
    );

    if (
      options.headers &&
      options.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      const params = new URLSearchParams(data).toString();

      req.write(params);
    } else {
      req.write(JSON.stringify(data));
    }

    req.on("error", (e: Error) => {
      console.log("🚀 ~ file: api.server.ts:140 ~ req.on ~ e:", e);
      requestAPILogger.error(`[ERROR - req]: ${e.message}`);
      reject(e);
    });

    req.end();
  });
};

export default HTTPService;
