// Dependencias
import React, { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Estilos
import "../assets/styles/main-layout.scss";

import { userLogout } from "../store/reducers/user";

import { accountantLinked } from "../store/reducers/accountant";

import type { AppDispatch, RootState } from "../store";

interface Props {}

const MainLayout = (_props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const { linkedAccountant } = useSelector(
    (state: RootState) => state.accountant,
  );

  const handleLogout = () => {
    dispatch(userLogout());
  };

  useEffect(() => {
    if (!user.name) {
      navigate("/acceso");
    }

    if (user.role && user.role === "user") {
      dispatch(accountantLinked());
    }
    () => {};
  }, [user]);

  return (
    <>
      <header
        className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow"
        data-bs-theme="dark"
      >
        <a
          className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white"
          href="#"
        >
          Webapp
        </a>

        <ul className="navbar-nav flex-row d-md-none">
          <li className="nav-item text-nowrap">
            <button
              className="nav-link px-3 text-white"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list" />
            </button>
          </li>
        </ul>
      </header>
      <div className="container-fluid">
        <div className="row content">
          <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
            <div
              className="offcanvas-md offcanvas-end bg-body-tertiary"
              tabIndex={-1}
              id="sidebarMenu"
              aria-labelledby="sidebarMenuLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="sidebarMenuLabel">
                  Webapp
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  data-bs-target="#sidebarMenu"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link to="/inicio" className="nav-link active">
                      <i className="bi bi-house" />
                      &nbsp; Home
                    </Link>
                  </li>
                </ul>

                {user?.role === "user" && (
                  <>
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                      <span>Contadores</span>
                    </h6>
                    <ul className="nav flex-column mb-auto">
                      <li className="nav-item">
                        <Link
                          to="/enlazar-contador"
                          className="nav-link active"
                        >
                          <i className="bi bi-folder-plus" />
                          &nbsp;{" "}
                          {linkedAccountant
                            ? linkedAccountant.firstName +
                              " " +
                              linkedAccountant.lastName
                            : "Link accountant"}
                        </Link>
                      </li>
                    </ul>
                  </>
                )}

                <hr className="my-3" />

                <ul className="nav flex-column mb-auto">
                  <li className="nav-item">
                    <span
                      className="nav-link"
                      role="button"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-door-closed" />
                      &nbsp; Sign out
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
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
