// Dependencias
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { createStore } from "./store";

// App
import App from "./App";

// Estilos
import "./assets/styles/main.scss";

// Create Redux store with state injected by the server
const store = createStore(window["__PRELOADED_STATE__"]);

// Allow the passed state to be garbage-collected
delete window["__PRELOADED_STATE__"];

document.querySelector("#preloaded-state")?.remove();

const createApp = () => (
  <React.StrictMode>
    <BrowserRouter>
      <App store={store} />
    </BrowserRouter>
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
