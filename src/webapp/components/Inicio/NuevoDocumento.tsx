// Dependencias
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { ChangeEvent } from "react";

export type FormValues = {
  file: File;
  notes: string;
  share: boolean;
};

const initialValues: FormValues = {
  // @ts-ignore
  file: null,
  notes: "",
  share: false,
};

const NuevoDocumento = ({ handleSelectTab, onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      file: Yup.mixed().test(
        "required",
        "Este campo es requerido",
        // @ts-ignore
        (file: File) => {
          if (file) return true;
          return false;
        },
      ),
      notes: Yup.string().required("Este campo es requerido"),
      share: Yup.boolean().required("Este campo es requerido"),
    }),
    onSubmit,
  });

  const { values, handleChange, setFieldValue, dirty, isValid, handleSubmit } =
    formik;

  return (
    <section id="nuevo-documento" className="mt-3">
      <div className="d-flex justify-content-between b-2 mb-3 border-bottom">
        <h1>New document</h1>

        <div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handleSelectTab(0)}
          >
            Back
          </button>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="file" className="form-label">
              File
            </label>
            <input
              className="form-control"
              type="file"
              id="file"
              name="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const files = (e.target as HTMLInputElement).files;

                if (files) {
                  setFieldValue("file", files[0]);
                }
              }}
            />
          </div>

          <div className="col-12">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              className="form-control"
              placeholder="Notas"
              name="notes"
              id="notes"
              value={values.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="share"
            id="share"
            checked={values.share}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="share">
            Share
          </label>
        </div>

        <button
          className="btn btn-sm btn-dark mt-3"
          type="submit"
          disabled={!isValid || !dirty}
        >
          Upload document
        </button>
      </form>
    </section>
  );
};

export default NuevoDocumento;
