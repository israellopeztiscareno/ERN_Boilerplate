// Dependencias
import passportlocal from "passport-local";

// HTT Service
import HTTPService from "./helpers/api/api.server";

import { parseJWT } from "./helpers/utils";

import settings from "./settings";

const { KEYCLOAC_HOST, KEYCLOAC_PORT, KEYCLOAC_PROTOCOL } = settings;

const _localStaregy = passportlocal.Strategy;

export type DataResponse = {
  response: any;
};

export default (passport) => {
  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Used to deserialize the user
  passport.deserializeUser(async function (user, done) {
    done(null, { user, ...parseJWT(user.access_token) });
  });

  passport.use(
    new _localStaregy(async function (username, password, done) {
      try {
        const data = await HTTPService({
          method: "POST",
          hostname: KEYCLOAC_HOST,
          port: KEYCLOAC_PORT,
          protocol: KEYCLOAC_PROTOCOL,
          path: "/auth/realms/devsecops/protocol/openid-connect/token",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: {
            grant_type: "password",
            username,
            password,
            client_id: "dvscps",
          },
        });

        // @ts-ignore
        const user = JSON.parse(data.response);

        return done(null, user);
      } catch (err) {
        console.log("🚀 ~ file: passport.ts:53 ~ err:", err);

        return done("Invalid credentials", false);
      }
    }),
  );
};
