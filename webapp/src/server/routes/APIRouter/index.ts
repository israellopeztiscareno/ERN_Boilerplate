// Dependencias
import express from "express";

import type { Express } from "express";

// Routes
import Users from "./Users";

const APIRouter = (app: Express) => {
  const router = express.Router();

  app.use("/api", router);

  Users(router);

  return router;
};

export default APIRouter;
