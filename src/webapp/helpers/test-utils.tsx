// Dependencias
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route, BrowserRouter } from "react-router-dom";
import { render as rtlRender } from "@testing-library/react";

import type { MemoryRouterProps } from "react-router-dom";

import { createStore } from "../store";

export function renderWithProvider(
  Element,
  { state = {}, store = createStore(state), ...renderOptions } = {},
  { initialEntries }: MemoryRouterProps = {},
) {
  function Wrapper({ children }) {
    if (initialEntries && initialEntries.length) {
      return (
        <MemoryRouter initialEntries={[...initialEntries]}>
          <Provider store={store}>
            <Routes>
              <Route
                path="/actualizar-contrasena/:code"
                element={<Element />}
              />
            </Routes>
          </Provider>
        </MemoryRouter>
      );
    }

    return (
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    );
  }

  return rtlRender(Element, { wrapper: Wrapper, ...renderOptions });
}
