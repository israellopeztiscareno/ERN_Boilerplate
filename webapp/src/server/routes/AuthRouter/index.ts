// Dependencias
import express from "express";
import passport from "passport";

import type { Express } from "express";

// Routes
import Logout from "./Logout";

const AuthRouter = (app: Express) => {
  const router = express.Router();

  app.use("/auth", router);

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/inicio",
      failureRedirect: "/login/error",
    }),
  );

  Logout(router);

  return router;
};

export default AuthRouter;
