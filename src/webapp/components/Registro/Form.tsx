// Dependencias
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";

import type { FormikHelpers } from "formik";

export type FormValues = {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  isAccountant: boolean;
  profile?: string;
};

const initialValues: FormValues = {
  name: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
  isAccountant: false,
  profile: "",
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
      name: Yup.string().required("Este campo es requerido"),
      lastName: Yup.string().required("Este campo es requerido"),
      username: Yup.string().required("Este campo es requerido"),
      email: Yup.string()
        .email("Ingresa un email válido")
        .required("Este campo es requerido"),
      password: Yup.string().required("Este campo es requerido"),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
        .required("Este campo es requerido"),
      isAccountant: Yup.boolean().required(),
      profile: Yup.string().when("isAccountant", {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit,
    validateOnMount: false,
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
        <div className="col-12 col-md-6">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={clsx("form-control", [
                touched.name && errors.name ? "is-invalid" : "",
              ])}
              name="name"
              id="name"
              data-testid="registro__name"
              placeholder=""
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="name" className="form-label">
              Name
            </label>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={clsx("form-control", [
                touched.lastName && errors.lastName ? "is-invalid" : "",
              ])}
              name="lastName"
              id="lastName"
              data-testid="registro__lastName"
              placeholder=""
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="lastName" className="form-label">
              Last name
            </label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={clsx("form-control", [
                touched.username && errors.username ? "is-invalid" : "",
              ])}
              name="username"
              id="username"
              data-testid="registro__username"
              placeholder=""
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="username" className="form-label">
              Username
            </label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating mb-3">
            <input
              type="email"
              className={clsx("form-control", [
                touched.email && errors.email ? "is-invalid" : "",
              ])}
              name="email"
              id="email"
              data-testid="registro__email"
              placeholder=""
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="email" className="form-label">
              Email
            </label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating mb-3">
            <input
              type="password"
              className={clsx("form-control", [
                touched.password && errors.password ? "is-invalid" : "",
              ])}
              name="password"
              id="password"
              data-testid="registro__password"
              placeholder=""
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="password" className="form-label">
              Password
            </label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating mb-3">
            <input
              type="password"
              className={clsx("form-control", [
                touched.repeatPassword && errors.repeatPassword
                  ? "is-invalid"
                  : "",
              ])}
              name="repeatPassword"
              id="repeatPassword"
              data-testid="registro__repeatPassword"
              placeholder=""
              value={values.repeatPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="repeatPassword" className="form-label">
              Repeat password
            </label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="isAccountant"
              id="isAccountant"
              data-testid="registro__isAccountant"
              checked={values.isAccountant}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isAccountant">
              ¡I'm accountant!
            </label>
          </div>
        </div>

        {values.isAccountant && (
          <div className="col-12">
            <div className="form-floating">
              <textarea
                className={clsx("form-control", [
                  touched.profile && errors.profile ? "is-invalid" : "",
                ])}
                placeholder="Leave your profile here"
                name="profile"
                id="profile"
                data-testid="registro__profile"
                value={values.profile}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="profile">Profile</label>
            </div>
          </div>
        )}

        <div className="col-12">
          <div className="d-grid">
            <button
              className="btn btn-dark btn-lg"
              type="submit"
              disabled={!isValid || !dirty}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
