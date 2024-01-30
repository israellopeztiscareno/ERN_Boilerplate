// Dependencias
import React from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router-dom";

// Containers
import Inicio from "./pages/Inicio";

// import Modal from "./components/common/Modal";

// Layouts
import MainLayout from "./layouts/MainLayout";

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="inicio" element={<Inicio />} />
        </Route>
      </Routes>
    </Provider>
  );
};

export default App;
