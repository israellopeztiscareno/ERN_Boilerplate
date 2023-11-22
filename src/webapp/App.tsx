// Dependencias
import React from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router-dom";

// Containers
import Acceso from "./containers/Acceso";
import Registro from "./containers/Registro";
import RecuperarContrasena from "./containers/RecuperarContrasena";
import ActualizarContrasena from "./containers/ActualizarContrasena";

import Inicio from "./containers/Inicio";
import EnlazarContador from "./containers/EnlazarContador";

import Modal from "./components/common/Modal";

// Layouts
import MainLayout from "./layouts/MainLayout";

const RenderRoutes = () => {
  return (
    <Routes>
      <Route path="/acceso" element={<Acceso />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
      <Route
        path="/actualizar-contrasena/:code"
        element={<ActualizarContrasena />}
      />
      <Route path="/" element={<MainLayout />}>
        <Route path="inicio" element={<Inicio />} />
        <Route path="enlazar-contador" element={<EnlazarContador />} />
      </Route>
    </Routes>
  );
};

const App = ({ Router, routerProps, store }) => {
  return (
    <Provider store={store}>
      <Modal />
      <Router {...routerProps}>
        <RenderRoutes />
      </Router>
    </Provider>
  );
};

export default App;
