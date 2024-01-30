// Dependencias
import express from "express";
import passport from "passport";
import proxy from "express-http-proxy";
import compression from "compression";
import cookieSession from "cookie-session";
import helmet from "helmet";
import cors from "cors";
import path from "path";

import type { Express, Request, Response } from "express";

// Configuraciones
import settings from "./settings";

// Passport
import passportStrategy from "./passport-google";

// Webapp
import pages from "./pages";

// Routes
import AuthRouter from "./routes/AuthRouter";
import APIRouter from "./routes/APIRouter";
import GoogleRouter from "./routes/Google";

const { DEV_ASSETS_HOST, DEV_ASSETS_PORT } = settings;

// Express
const app: Express = express();

// CORS
app.use(cors({ origin: "*" }));

// Helmet
// app.use(helmet());

if (__DEV__) {
  app.set("trust proxy", 1);

  app.use(
    "/static",
    proxy(`${DEV_ASSETS_HOST}:${DEV_ASSETS_PORT}`, {
      proxyReqPathResolver: (req) => `/static${req.url}`,
    }),
  );
} else {
  app.use(express.static(path.join(__dirname, "./webapp/assets")));
}

// Gzip
app.use(compression());

// Parse JSON
app.use(express.json());

// Parse URL-encoded
app.use(express.urlencoded({ extended: true }));

// Sesión

app.use(
  cookieSession({
    name: "session",
    keys: ["r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#"],
    maxAge: 24 * 60 * 60 * 1000,
  }),
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request: Request, response: Response, next) {
  // @ts-ignore
  if (request.session && !request.session.regenerate) {
    // @ts-ignore
    request.session.regenerate = (cb) => {
      cb();
    };
  }

  // @ts-ignore
  if (request.session && !request.session.save) {
    // @ts-ignore
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Strategy
passportStrategy(passport);

// Auth router
AuthRouter(app);

// API Router
APIRouter(app);

// Google Router
GoogleRouter(app);

// All routes for webapp
app.use("/", pages);

export default app;
