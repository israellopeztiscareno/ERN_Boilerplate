import type { Request, Response } from "express";

import HTTPService from "../../helpers/api/api.server";

import accessMiddleware from "../../helpers/accessMiddleware";

import settings from "../../settings";

const { KEYCLOAC_HOST, KEYCLOAC_PORT, KEYCLOAC_PROTOCOL } = settings;

export default (router) => {
  const logout = async (req: Request, res: Response, _next) => {
    // @ts-ignore
    const { user } = req.user;
    /**
     * Elimina sesión
     */

    try {
      await HTTPService({
        method: "POST",
        hostname: KEYCLOAC_HOST,
        port: KEYCLOAC_PORT,
        protocol: KEYCLOAC_PROTOCOL,
        path: "/auth/realms/devsecops/protocol/openid-connect/logout",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          client_id: "dvscps",
          token_type_hint: "token",
          refresh_token: user.refresh_token,
        },
      });

      req.logout(async () => {
        res.json({ success: true });
      });
    } catch (err) {
      console.log("🚀 ~ file: Logout.ts:39 ~ logout ~ err:", err);
      return res.status(err.status).send({ message: "Error logging out" });
    }
  };

  //Link routes and functions
  router.post("/logout", accessMiddleware, logout);
};
