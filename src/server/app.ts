// Dependencias
import express from "express";
import passport from "passport";
import proxy from "express-http-proxy";
import compression from "compression";
import session from "express-session";
import cors from "cors";
import path from "path";

import type { Express } from "express";

// Configuraciones
import settings from "./settings";

// Passport
import passportStrategy from "./passport";

// Webapp
import pages from "./pages";

// Routes
import AuthRouter from "./routes/AuthRouter";
import APIRouter from "./routes/APIRouter";

const { DEV_ASSETS_HOST, DEV_ASSETS_PORT } = settings;

// Express
const app: Express = express();

// CORS
app.use(cors({ origin: "*" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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
  session({
    name: "app.sid",
    secret: "r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#",
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    maxAge: 24 * 60 * 60 * 1000,
    secure: __PROD__,
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Strategy
passportStrategy(passport);

// X-Powered By
app.use((_req, res, next) => {
  res.setHeader("X-Powered-By", "InterWare de México");
  next();
});

// All routes for webapp
app.use("/", passport.authenticate("session"), pages);

// Auth router
AuthRouter(app);

// API Router
APIRouter(app);

export default app;
