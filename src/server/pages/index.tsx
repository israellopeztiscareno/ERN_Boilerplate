// Dependencias
import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { createStore } from "../../webapp/store";

import type { Request, Response } from "express";

// Assets
import assets from "../../../dist/assets.json";

// Webapp
import App from "../../webapp/App";

// Express router
const pages = express.Router();

pages.get("/*", async (req: Request, res: Response) => {
  let preloadedState = {};

  if (req.user) {
    //@ts-ignore
    const { name, email, realm_access } = req.user;

    const role = realm_access.roles.includes("accountant")
      ? "accountant"
      : "user";

    //@ts-ignore
    preloadedState.user = {
      name: name,
      email,
      role: role,
    };
  }

  const store = createStore(preloadedState);

  const content = renderToString(
    <App
      Router={StaticRouter}
      routerProps={{
        location: req.originalUrl,
      }}
      store={store}
    />,
  );

  const injectedPreloadState = store.getState();

  res.render("index", {
    content,
    // titleTag: helmet.title.toString(),
    injectedPreloadState,
    assets,
    isProd: __PROD__,
  });
});

export default pages;
