// Dependencias
import React from "react";
import express from "express";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import fs from "fs";
import path from "path";

import type { Request, Response } from "express";

// Webapp
import App from "../../webapp/App";
import { createStore } from "../../webapp/store";

// Express router
const pages = express.Router();

// Ruta para todas las páginas
pages.get("/*", async (req: Request, res: Response) => {
  if (!req.user) {
    res.redirect(302, "/google");
  } else {
    try {
      const { id, name, email } = req.user;

      // Estado inicial vacío para store
      let preloadedState = {
        user: { id, name, email },
      };

      // Crea una nueva instancia de store
      const store = createStore(preloadedState);

      // Renderiza la aplicación de React en un contexto estático
      const jsx = (
        <StaticRouter location={req.url}>
          <App store={store} />
        </StaticRouter>
      );

      // Convierte la aplicación React a una cadena HTML
      const html = ReactDOMServer.renderToString(jsx);

      // Lee el archivo HTML base
      fs.readFile(
        path.join(__dirname, "webapp/assets/static", "index.html"),
        "utf8",
        (err, htmlData) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }

          // Modifica dinámicamente el contenido del archivo HTML con el HTML renderizado
          const modifiedHTML = htmlData
            .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
            .replace(
              '<script id="preloaded-state"></script>',
              `<script id="preloaded-state">window.__PRELOADED_STATE__ = ${JSON.stringify(
                preloadedState,
              ).replace(/</g, "\\u003c")};</script>`,
            );

          // Envía la respuesta al cliente con el HTML modificado
          res.send(modifiedHTML);
        },
      );
    } catch (error) {
      console.error(error);
      // Manejo de errores general
      res.status(500).send("Error interno del servidor");
    }
  }
});

export default pages;
