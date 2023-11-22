// Dependencias
import multer from "multer";
import FormData from "form-data";
import path from "path";
import { createReadStream, unlink } from "fs";
import winston from "winston";

import type { Request, Response } from "express";

// HTTP Service
import HTTPService from "../../helpers/api/api.server";

import { parseJWT } from "../../helpers/utils";
import settings from "../../settings";

import { createLoggerConfig } from "../../helpers/logger";

const { DOCUMENTS_HOST, DOCUMENTS_PORT, DOCUMENTS_PROTOCOL } = settings;

const REQUEST_API = "API";

winston.loggers.add(REQUEST_API, createLoggerConfig(REQUEST_API));
const requestAPILogger = winston.loggers.get(REQUEST_API);

export default (router) => {
  const documentSearchAll = async (req: Request, res: Response) => {
    const { username } = req.body;
    // @ts-ignore
    const { preferred_username } = req.user;

    const bodyParams = new URLSearchParams({
      username,
      shared: "True",
    }).toString();

    const params = new URLSearchParams({
      username: preferred_username,
    }).toString();

    try {
      const data = await HTTPService({
        method: "GET",
        hostname: DOCUMENTS_HOST,
        port: DOCUMENTS_PORT,
        protocol: DOCUMENTS_PROTOCOL,
        path: `/documents/search-all${
          username ? "/shared?" + bodyParams : "?" + params
        }`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // @ts-ignore
      const responseJSON = JSON.parse(data.response);
      // @ts-ignore
      return res.status(data.status).send(responseJSON);
    } catch (err) {
      return res.status(err.status).send(err.error);
    }
  };

  const documentsUpload = (req: Request, res: Response) => {
    // @ts-ignore
    const { user } = req.user;
    const { preferred_username } = parseJWT(user.access_token);

    const UPLOAD_PATH = path.join(__dirname, "..", "src", "server", "tmp");

    const storage = multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, UPLOAD_PATH);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    const upload = multer({ storage: storage }).any();

    try {
      upload(req, res, async (err) => {
        if (err) {
          requestAPILogger.error(`[ERROR - res]: ${err}`);

          return res
            .status(500)
            .send({ message: "Error uploading document - upload" });
        }

        const { share, notes } = req.body;

        const form = new FormData();
        // @ts-ignore
        form.append("username", preferred_username);
        form.append("description", notes);
        form.append("shared", share);

        req["files"].map((file) => {
          form.append("file", createReadStream(file.path));
        });

        form.submit(
          {
            protocol: DOCUMENTS_PROTOCOL,
            host: DOCUMENTS_HOST,
            port: DOCUMENTS_PORT,
            path: "/documents/upload",
            // @ts-ignore
            requestCert: true,
            rejectUnauthorized: false,
          },
          (error, response) => {
            /**
             * Delete file
             */
            req["files"].map((file) => {
              unlink(file.path, (err) => {
                if (err) {
                  requestAPILogger.error(
                    `[ERROR - delete document]: ${file.path}`,
                  );
                }

                requestAPILogger.error(
                  `File ${file.path} deleted successfully`,
                );
              });
            });

            if (error) {
              requestAPILogger.error(
                `[ERROR] Error uploading document - request ${error}`,
              );

              return res
                .status(500)
                .send({ message: "Error uploading document - request" });
            }

            let body = "";

            response.on("data", (chunk) => (body += chunk.toString()));
            response.on("end", () => {
              if (response.statusCode >= 200 && response.statusCode <= 300) {
                return res.status(200).send("Document uploaded successfully");
              } else {
                return res
                  .status(500)
                  .send({ message: "Error uploading document - statusCode" });
              }
            });
            response.resume();
          },
        );
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  };

  const documentsDownload = async (req: Request, res: Response) => {
    const { documentId } = req.body;

    try {
      const data = await HTTPService({
        method: "GET",
        hostname: DOCUMENTS_HOST,
        port: DOCUMENTS_PORT,
        protocol: DOCUMENTS_PROTOCOL,
        path: `/documents/download?documentId=${documentId}`,
        headers: {},
      });

      // @ts-ignore
      const responseJSON = JSON.parse(data.response);
      // @ts-ignore
      return res.status(data.status).send(responseJSON);
    } catch (err) {
      return res.status(err.status).send(err.error);
    }
  };

  //Link routes and functions
  router.post("/documents-get-all", documentSearchAll);
  router.post("/documents-upload", documentsUpload);
  router.post("/documents-download", documentsDownload);
};
