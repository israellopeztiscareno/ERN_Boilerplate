import type { Request, Response } from "express";

// HTTP Service
import HTTPService, {
  HTTPResponse,
  SuccessResponse,
  ErrorResponse,
} from "../../helpers/api/api.server";

export default (router) => {
  const usersGet = async (req: Request, res: Response) => {
    const { jwt, id } = req.user;

    try {
      const request: HTTPResponse = await HTTPService({
        method: "GET",
        hostname: "127.0.0.1",
        port: 1337,
        protocol: "http:",
        path: "/api/users/me?populate=*",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      if ("response" in request) {
        const data: SuccessResponse = request;

        const { user_type } = data.response;

        return res.json({ role: user_type.Role });
      } else {
        const err: ErrorResponse = request;
        return res.status(err.status).send(err.error);
      }
    } catch (err) {
      return res.status(500).send({ message: "Error - usersGet" });
    }
  };

  //Link routes and functions
  router.post("/users/get", usersGet);
};
