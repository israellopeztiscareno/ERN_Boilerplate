import type { Request, Response } from "express";

// HTTP Service
import HTTPService from "../../helpers/api/api.server";

import settings from "../../settings";

const { USERS_HOST, USERS_PORT, USERS_PROTOCOL } = settings;

export default (router) => {
  const usersGetAll = async (req: Request, res: Response) => {
    // @ts-ignore
    const { preferred_username } = req.user;
    const params = new URLSearchParams({
      accountantUsername: preferred_username,
    });

    try {
      const data = await HTTPService({
        method: "GET",
        hostname: USERS_HOST,
        port: USERS_PORT,
        protocol: USERS_PROTOCOL,
        path: `/users/linked-users?${params}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // @ts-ignore
      const responseJSON = JSON.parse(data.response);
      // @ts-ignore
      return res.status(200).send(responseJSON);
    } catch (err) {
      return res.status(err.status).send({ message: "Error - usersGetAll" });
    }
  };

  const accountantGetByUsername = async (req: Request, res: Response) => {
    // @ts-ignore
    const { username } = req.body;
    const params = new URLSearchParams({ username }).toString();

    try {
      const data = await HTTPService({
        method: "GET",
        hostname: USERS_HOST,
        port: USERS_PORT,
        protocol: USERS_PROTOCOL,
        path: `/users/search?${params}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      // @ts-ignore
      const responseJSON = JSON.parse(data.response);
      // @ts-ignore
      return res.status(data.status).send(responseJSON);
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Error - accountantGetByUsername" });
    }
  };

  const accountantLinked = async (req: Request, res: Response) => {
    // @ts-ignore
    const { preferred_username } = req.user;
    const params = new URLSearchParams({ username: preferred_username });

    try {
      const data = await HTTPService({
        method: "GET",
        hostname: USERS_HOST,
        port: USERS_PORT,
        protocol: USERS_PROTOCOL,
        path: `/users/linked-accountant?${params}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // @ts-ignore
      const responseJSON = JSON.parse(data.response);
      // @ts-ignore
      return res.status(data.status).send(responseJSON);
    } catch (err) {
      return res
        .status(err.status)
        .send({ message: "Error - accountantLinked" });
    }
  };

  const accountantLink = async (req: Request, res: Response) => {
    // @ts-ignore
    const { preferred_username } = req.user;
    const { username } = req.body;

    try {
      const data = await HTTPService({
        method: "GET",
        hostname: USERS_HOST,
        port: USERS_PORT,
        protocol: USERS_PROTOCOL,
        path: `/users/link-accountant?username=${preferred_username}&accountant=${username}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // @ts-ignore
      return res.status(data.status).send({ message: "Sucessfully linked" });
    } catch (err) {
      console.log("🚀 ~ file: Users.ts:124 ~ accountantLink ~ err:", err);
      return res.status(err.status).send({ message: "Error - accountantLink" });
    }
  };

  const accountantRemove = async (req: Request, res: Response) => {
    // @ts-ignore
    const { preferred_username } = req.user;

    try {
      const data = await HTTPService({
        method: "GET",
        hostname: USERS_HOST,
        port: USERS_PORT,
        protocol: USERS_PROTOCOL,
        path: `/users/remove-link?username=${preferred_username}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // @ts-ignore
      return res.status(data.status).send({ message: "Sucessfully linked" });
    } catch (err) {
      console.log("🚀 ~ file: Users.ts:124 ~ accountantLink ~ err:", err);
      return res.status(err.status).send({ message: "Error - accountantLink" });
    }
  };

  //Link routes and functions
  router.post("/users-get-all", usersGetAll);
  router.post("/accountant-get-by-username", accountantGetByUsername);
  router.post("/accountant-linked", accountantLinked);
  router.post("/accountant-link", accountantLink);
  router.post("/accountant-remove", accountantRemove);
};
