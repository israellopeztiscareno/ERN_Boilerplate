// Dependencias
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";

import type { FormikHelpers } from "formik";

export type FormValues = {
  password: string;
  confirmPassword: string;
};

const initialValues = {
  password: "",
  confirmPassword: "",
};

interface Props {
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<typeof initialValues>,
  ) => void;
  setCode: (code: string) => void;
}

const Form = ({ onSubmit, setCode }: Props) => {
  let { code } = useParams();

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      password: Yup.string().required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
        .required("Este campo es requerido"),
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

  useEffect(() => {
    if (code) {
      setCode(code);
    }
  }, [code]);

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
              type="password"
              className={clsx("form-control", [
                touched.password && errors.password ? "is-invalid" : "",
              ])}
              name="password"
              id="password"
              data-testid="actualizar_contrasena__password"
              placeholder="name@example.com"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="password"
              className={clsx("form-control", [
                touched.confirmPassword && errors.confirmPassword
                  ? "is-invalid"
                  : "",
              ])}
              name="confirmPassword"
              id="confirmPassword"
              data-testid="actualizar_contrasena__confirmPassword"
              placeholder="name@example.com"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
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
              Actualizar contraseña
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
