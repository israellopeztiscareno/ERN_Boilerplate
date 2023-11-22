// Dependencias
import React from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { FormikHelpers } from "formik";
import type { RootState } from "../../store";

export type SearchFormValues = {
  username: string;
};

const initialValues = {
  username: "",
};

interface Props {
  onSubmit: (
    values: SearchFormValues,
    formikHelpers: FormikHelpers<typeof initialValues>,
  ) => void;
}

const Form = ({ onSubmit }: Props) => {
  const { linkedAccountant } = useSelector(
    (state: RootState) => state.accountant,
  );

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required(),
    }),
    onSubmit,
  });

  const { values, dirty, isValid, handleChange, handleSubmit } = formik;

  if (linkedAccountant) {
    return null;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Username"
          name="username"
          id="username"
          value={values.username}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="btn btn-sm btn-dark"
          disabled={!isValid || !dirty}
        >
          <i className="bi bi-search" />
        </button>
      </div>
    </form>
  );
};

export default Form;
