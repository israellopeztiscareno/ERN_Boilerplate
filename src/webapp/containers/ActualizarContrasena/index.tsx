// Dependencias
import React, { useState } from "react";

import type { FormikHelpers } from "formik";

// Layout
import EnrollmentLayout from "../../layouts/EnrollmentLayout";

// Components
import Form from "../../components/ActualizarContrasena/Form";
import type { FormValues } from "../../components/ActualizarContrasena/Form";

import HTTPService from "../../helpers/api/api.client";

const ActualizarContrasena = () => {
  const [code, setCode] = useState<string>("");

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const res = await HTTPService("POST", "/auth/update-password", {
        code,
        ...values,
      });

      console.log("🚀 ~ file: index.tsx:13 ~ onSubmit ~ res:", res);

      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EnrollmentLayout id="actualizar-contrasena" col="col-6">
      <div className="col-12 d-flex align-items-center justify-content-center">
        <div className="col-12">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <Form onSubmit={handleSubmit} setCode={setCode} />
          </div>
        </div>
      </div>
    </EnrollmentLayout>
  );
};

export default ActualizarContrasena;
