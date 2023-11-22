// Dependencias
import React from "react";
import { useNavigate, Link } from "react-router-dom";

import type { FormikHelpers } from "formik";

// Layout
import EnrollmentLayout from "../../layouts/EnrollmentLayout";

// Components
import Form from "../../components/RecuperarContrasena/Form";
import type { FormValues } from "../../components/RecuperarContrasena/Form";

import HTTPService from "../../helpers/api/api.client";

const RecuperarContrasena = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const res = await HTTPService("POST", "/auth/reset-password", values);

      console.log("🚀 ~ file: index.tsx:13 ~ onSubmit registro ~ res:", res);

      resetForm();
      navigate("/acceso");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EnrollmentLayout id="recuperar-contrasena" col="col-6">
      <div className="col-12 d-flex align-items-center justify-content-center">
        <div className="col-12">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <Form onSubmit={handleSubmit} />
            <div className="row">
              <div className="col-12">
                <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-4">
                  <Link
                    to="/acceso"
                    className="link-secondary text-decoration-none"
                  >
                    Regresar
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

export default RecuperarContrasena;
