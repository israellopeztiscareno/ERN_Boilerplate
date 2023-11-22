// Dependencias
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";

import type { FormikHelpers } from "formik";

export type FormValues = {
  email: string;
};

const initialValues = {
  email: "",
};

interface Props {
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<typeof initialValues>,
  ) => void;
}

const RecuperarContrasena = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Ingresa un email válido")
        .required("Este es un campo requerido"),
    }),
    onSubmit,
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    dirty,
    isValid,
  } = formik;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="row gy-3 overflow-hidden">
        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="email"
              className={clsx("form-control", [
                touched.email && errors.email && "is-invalid",
              ])}
              name="email"
              id="email"
              data-testid="recuperar_contrasena__email"
              placeholder="name@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="email" className="form-label">
              Email
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="d-grid">
            <button
              className="btn btn-dark btn-lg"
              type="submit"
              disabled={!isValid || !dirty}
            >
              Enviar correo de recuperación
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RecuperarContrasena;
