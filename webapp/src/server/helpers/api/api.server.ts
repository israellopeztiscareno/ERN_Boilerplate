// Dependencias
import http from "http";
import https from "https";
import winston from "winston";

import type { OutgoingHttpHeaders, RequestOptions } from "http";

import { createLoggerConfig } from "../../helpers/logger";

const REQUEST_API = "API";

winston.loggers.add(REQUEST_API, createLoggerConfig(REQUEST_API));
const requestAPILogger = winston.loggers.get(REQUEST_API);

export interface ErrorResponse {
  status: number;
  error: string;
}

export interface SuccessResponse {
  status: number;
  response: any;
  headers: http.IncomingHttpHeaders;
}

export type HTTPResponse = ErrorResponse | SuccessResponse;

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

interface HTTPServiceProps {
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
}: HTTPServiceProps): Promise<HTTPResponse> => {
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
        let responseString: string[] = [];

        res.on("data", (chunk) => {
          responseString.push(chunk);
        });

        res.on("end", () => {
          const responseBody = responseString.join("");

          if (
            responseString.length === 0 &&
            res.statusCode > 200 &&
            res.statusCode < 300
          ) {
            // Captura el caso exitoso cuando responseString.length es 0 y statusCode > 200
            const successResponse: SuccessResponse = {
              status: res.statusCode,
              response: null,
              headers: res.headers,
            };

            resolve(successResponse);
          } else if (responseString.length === 0 && res.statusCode > 300) {
            const responseError: ErrorResponse = {
              status: res.statusCode || 500,
              error: "Servicio temporalmente no disponible",
            };

            reject(responseError);
          } else {
            try {
              const responseObject = JSON.parse(responseBody);

              if (res.statusCode >= 200 && res.statusCode < 300) {
                const successResponse: SuccessResponse = {
                  status: res.statusCode,
                  response: responseObject,
                  headers: res.headers,
                };

                resolve(successResponse);
              } else {
                const errorResponse: ErrorResponse = {
                  status: res.statusCode,
                  error: responseObject,
                };

                reject(errorResponse);
              }
            } catch (error) {
              const responseError: ErrorResponse = {
                status: res.statusCode || 500,
                error: "Error al parsear la respuesta JSON",
              };

              reject(responseError);
            }
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
      requestAPILogger.error(`[ERROR - req]: ${e.message}`);
      reject(e);
    });

    req.end();
  });
};

export default HTTPService;
