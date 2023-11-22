// Dependencias
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { createStore } from "./store";

// App
import App from "./App";

// Estilos
import "./assets/styles/main.scss";

// Bootstrap JS
import "bootstrap/dist/js/bootstrap";

// Bootstrap icons
import "bootstrap-icons/font/bootstrap-icons.min.css";

const createApp = () => (
  <React.StrictMode>
    <App
      Router={BrowserRouter}
      routerProps={{}}
      store={createStore(window.__PRELOADED_STATE__)}
    />
  </React.StrictMode>
);

let rootElement: HTMLElement | null = document.getElementById("root");

if (!rootElement) {
  rootElement = document.createElement("div");
  rootElement.setAttribute("id", "root");
}

const root = hydrateRoot(rootElement, createApp());

if (module.hot) {
  module.hot.accept("./App", () => {
    root.render(createApp());
  });
}
