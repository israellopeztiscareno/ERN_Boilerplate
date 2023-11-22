// Dependencias
import passport from "passport";

import type { Request, Response } from "express";

import { parseJWT } from "../../helpers/utils";

export default (router) => {
  const login = async (req: Request, res: Response, next) => {
    /**
     * Autentica usuario
     */
    passport.authenticate("local", (error, user) => {
      if (error) {
        return res.status(400).json(error);
      }

      req.login(user, async () => {
        const { name, email, realm_access } = parseJWT(user.access_token);

        res.json({ name, email, realm_access });
      });
    })(req, res, next);
  };

  //Link routes and functions
  router.post("/login", login);
};
