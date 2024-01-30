// Dependencias
import express from "express";
import passport from "passport";

import type { Express } from "express";

const GoogleRouter = (app: Express) => {
  const router = express.Router();

  app.use("/", router);

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] }),
  );

  return router;
};

export default GoogleRouter;
