// Dependencias
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { FormikHelpers } from "formik";

export type FormValues = {
  username: string;
  password: string;
};

const initialValues: FormValues = {
  username: "",
  password: "",
};

interface Props {
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<typeof initialValues>,
  ) => void;
}

const Form = ({ onSubmit }: Props) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      username: Yup.string().required(),
      password: Yup.string().required(),
    }),
    onSubmit,
  });

  const { values, handleChange, dirty, isValid, handleSubmit } = formik;

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
              type="text"
              className="form-control"
              name="username"
              id="username"
              data-testid="acceso__username"
              placeholder=""
              value={values.username}
              onChange={handleChange}
            />
            <label htmlFor="username" className="form-label">
              Username
            </label>
          </div>
        </div>
        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              data-testid="acceso__password"
              placeholder=""
              value={values.password}
              onChange={handleChange}
            />
            <label htmlFor="password" className="form-label">
              Password
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
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default Form;
