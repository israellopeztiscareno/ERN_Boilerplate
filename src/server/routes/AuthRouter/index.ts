// Dependencias
import express from "express";

import type { Express } from "express";

// Routes
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";

const AuthRouter = (app: Express) => {
  const router = express.Router();

  app.use("/auth", router);

  Login(router);
  Logout(router);
  Register(router);

  return router;
};

export default AuthRouter;
