// Dependencias
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// HTTP Service
import HTTPService, {
  HTTPResponse,
  SuccessResponse,
  ErrorResponse,
} from "./helpers/api/api.server";

const GOOGLE_CLIENT_ID =
  "779872196671-f142f6oen169117pm82in6q971vlh9vc.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

export default (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, _refreshToken, _profile, done) {
        /**
         * Login en Strapi
         */
        try {
          const request: HTTPResponse = await HTTPService({
            method: "GET",
            hostname: "127.0.0.1",
            port: 1337,
            protocol: "http:",
            path: `/api/auth/google/callback?access_token=${accessToken}`,
            headers: {
              "Content-Type": "application/json",
            },
          });

          if ("response" in request) {
            const data: SuccessResponse = request;

            const { jwt, user } = data.response;

            return done(null, { jwt, ...user });
          } else {
            const error: ErrorResponse = request;
            return done(error, false);
          }
        } catch (err) {
          return done("Invalid credentials", false);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
