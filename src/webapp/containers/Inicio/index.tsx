// Dependencias
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Componentes
import PerfilBasico from "../../components/Inicio/PerfilBasico";
import PerfilContador from "../../components/Inicio/PerfilContador";

// Redux
import { documentsSearchAll } from "../../store/reducers/documents";
import { usersGetAll } from "../../store/reducers/users";

import type { AppDispatch, RootState } from "../../store";

const Inicio = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user && user.role === "user") {
      dispatch(documentsSearchAll(null));
    }

    if (user && user.role === "accountant") {
      dispatch(usersGetAll());
    }
  }, [user]);

  if (user?.role === "user") {
    return <PerfilBasico />;
  }

  return <PerfilContador />;
};

export default Inicio;
