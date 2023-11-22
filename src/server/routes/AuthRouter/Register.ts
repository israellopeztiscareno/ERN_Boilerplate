import type { Request, Response } from "express";

import HTTPService from "../../helpers/api/api.server";

import setting from "../../settings";

const {
  KEYCLOAC_HOST,
  KEYCLOAC_PORT,
  KEYCLOAC_PROTOCOL,
  USERS_HOST,
  USERS_PORT,
  USERS_PROTOCOL,
} = setting;

export default (router) => {
  const register = async (req: Request, res: Response, _next) => {
    // @ts-ignore
    const { username, email, name, lastName, password, isAccountant, profile } =
      req.body;
    /**
     * Get Token
     */
    try {
      const dataToken = await HTTPService({
        method: "POST",
        hostname: KEYCLOAC_HOST,
        port: KEYCLOAC_PORT,
        protocol: KEYCLOAC_PROTOCOL,
        path: "/auth/realms/devsecops/protocol/openid-connect/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          grant_type: "client_credentials",
          client_secret: "XUTjSoWeibq17ECFUCNsZW34TPCKdJba",
          client_id: "dvscp-admin",
        },
      });

      // @ts-ignore
      const responseJSONToken = JSON.parse(dataToken.response);
      /**
       * Create user
       */
      await HTTPService({
        method: "POST",
        hostname: KEYCLOAC_HOST,
        port: KEYCLOAC_PORT,
        protocol: KEYCLOAC_PROTOCOL,
        path: "/auth/admin/realms/devsecops/users",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${responseJSONToken.access_token}`,
        },
        data: {
          username,
          enabled: true,
          email,
          firstName: name,
          lastName,
          credentials: [
            {
              type: "password",
              value: password,
              temporary: false,
            },
          ],
        },
      });
      /**
       * Get USERID
       */
      const dataGetUSERID = await HTTPService({
        method: "GET",
        hostname: KEYCLOAC_HOST,
        port: KEYCLOAC_PORT,
        protocol: KEYCLOAC_PROTOCOL,
        path: `/auth/admin/realms/devsecops/users?username=${username}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${responseJSONToken.access_token}`,
        },
      });

      // @ts-ignore
      const responseJSONUserID = JSON.parse(dataGetUSERID.response);
      /**
       * Set user role
       */
      await HTTPService({
        method: "POST",
        hostname: KEYCLOAC_HOST,
        port: KEYCLOAC_PORT,
        protocol: KEYCLOAC_PROTOCOL,
        path: `/auth/admin/realms/devsecops/users/${responseJSONUserID[0].id}/role-mappings/realm`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${responseJSONToken.access_token}`,
        },
        data: [
          isAccountant
            ? {
                id: "043d5df8-646a-4401-a489-7d4a9de15d77",
                name: "accountant",
              }
            : { id: "aff36bb9-ba71-4680-8731-f3e14162e694", name: "user" },
        ],
      });
      /**
       * Revoke token
       */
      await HTTPService({
        method: "POST",
        hostname: KEYCLOAC_HOST,
        port: KEYCLOAC_PORT,
        protocol: KEYCLOAC_PROTOCOL,
        path: "/auth/realms/devsecops/protocol/openid-connect/revoke",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          client_secret: "XUTjSoWeibq17ECFUCNsZW34TPCKdJba",
          client_id: "dvscp-admin",
          token_type_hint: "token",
          token: responseJSONToken.access_token,
        },
      });

      await HTTPService({
        method: "POST",
        hostname: USERS_HOST,
        port: USERS_PORT,
        protocol: USERS_PROTOCOL,
        path: "/users/add",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: username,
          email: email,
          firstName: name,
          lastName: lastName,
          type: isAccountant ? "accountant" : "client",
          profile: isAccountant ? profile : undefined,
        },
      });

      // @ts-ignore
      res.status(200).send("User created succesfully");
    } catch (err) {
      console.error(err);
      return res.status(err.status).send({ message: "Error register user" });
    }
  };

  //Link routes and functions
  router.post("/register", register);
};
