// Dependencias
import express from "express";
import passport from "passport";

import type { Express } from "express";

// Access middleware
import accessMiddleware from "../../helpers/accessMiddleware";

// Routes
import Documents from "./Documents";
import Users from "./Users";

const APIRouter = (app: Express) => {
  const router = express.Router();

  app.use("/api", [passport.authenticate("session"), accessMiddleware], router);

  Documents(router);
  Users(router);

  return router;
};

export default APIRouter;
