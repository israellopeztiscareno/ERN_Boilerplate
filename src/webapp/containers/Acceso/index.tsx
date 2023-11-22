// Dependencias
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import type { FormikHelpers } from "formik";

import type { AppDispatch, RootState } from "../../store";

// Layout
import EnrollmentLayout from "../../layouts/EnrollmentLayout";

// Components
import Form from "../../components/Acceso/Form";
import type { FormValues } from "../../components/Acceso/Form";

import { userLogin } from "../../store/reducers/user";

const Acceso = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    const res = await dispatch(userLogin(values));

    if (res.meta.requestStatus !== "rejected") {
      resetForm();
    }
  };

  //@ts-ignore
  const user = useSelector((state: RootState) => state.user);

  if (user.name && typeof window !== "undefined") {
    return <Navigate to="/inicio" />;
  }

  return (
    <EnrollmentLayout id="acceso">
      <div className="col-12 col-md-6">
        <img
          className="img-fluid rounded-start w-100 h-100 object-fit-cover"
          loading="lazy"
          src="https://placehold.co/1440x1440"
          alt=""
        />
      </div>
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div className="col-12 col-lg-11 col-xl-10">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <Form onSubmit={handleSubmit} />
            <div className="row">
              <div className="col-12">
                <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-4">
                  <Link
                    to="/registro"
                    className="link-secondary text-decoration-none"
                  >
                    Create new account
                  </Link>
                  <Link
                    to="/recuperar-contrasena"
                    className="link-secondary text-decoration-none"
                  >
                    Forgot password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnrollmentLayout>
  );
};

export default Acceso;
