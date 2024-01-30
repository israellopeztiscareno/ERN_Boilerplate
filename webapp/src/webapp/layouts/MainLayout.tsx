// Dependencias
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { usersGet, userLogout } from "../store/reducers/user";

import type { AppDispatch, RootState } from "../store";

interface Props {}

const MainLayout = (_props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  console.log("🚀 ~ MainLayout ~ user:", user);

  const handleLogout = async () => {
    await dispatch(userLogout());
    window.location.replace("/google");
  };

  useEffect(() => {
    (async () => {
      await dispatch(usersGet());
    })();
    return () => {};
  }, [dispatch]);

  return (
    <>
      <nav className="bp5-navbar {{.modifier}}">
        <div className="bp5-navbar-group bp5-align-left">
          <div className="bp5-navbar-heading">Webapp</div>
        </div>
        <div className="bp5-navbar-group bp5-align-right">
          <button className="bp5-button bp5-minimal">Inicio</button>
          <button className="bp5-button bp5-minimal">Otro</button>
          <span className="bp5-navbar-divider"></span>
          <button
            className="bp5-button bp5-minimal bp5-icon-log-out"
            onClick={handleLogout}
          />
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container text-center">
          <span className="text-muted">
            &copy;{" "}
            {`InterWare ${new Date().getFullYear()}. Todos los derechos reservados`}
          </span>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
