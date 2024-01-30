import type { Request, Response } from "express";

export default (router) => {
  const logout = async (req: Request, res: Response, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(200, "/google");
    });
  };

  //Link routes and functions
  router.post("/logout", logout);
};
