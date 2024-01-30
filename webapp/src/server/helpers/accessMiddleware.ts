import type { Request, Response } from "express";

const accessMiddleware = (req: Request, res: Response, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // @ts-ignore
  const { exp } = req.user;

  if (exp && Date.now() >= exp * 1000) {
    return res.status(401).json({ message: "Token expired" });
  }

  next();
};

export default accessMiddleware;
