// Dependencias
import passportlocal from "passport-local";

// HTT Service
import HTTPService from "./helpers/api/api.server";

import { parseJWT } from "./helpers/utils";

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
    "strapi-google-auth",
    new _localStaregy({ passReqToCallback: true }, async function (
      req,
      _username,
      _password,
      done,
    ) {
      try {
        const data = await HTTPService({
          method: "GET",
          hostname: "localhost",
          port: 1337,
          protocol: "http:",
          path: "/api/auth/google/callback",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: { ...req.query },
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
