// Dependencias
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import type { FormikHelpers } from "formik";
import type { AppDispatch } from "../../store";

// Layout
import EnrollmentLayout from "../../layouts/EnrollmentLayout";

// Components
import Form from "../../components/Registro/Form";
import type { FormValues } from "../../components/Registro/Form";

import { userRegister } from "../../store/reducers/user";

const Registro = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    const res = await dispatch(userRegister(values));
    if (res.meta.requestStatus !== "rejected") {
      navigate("/acceso");
      resetForm();
    }
  };

  return (
    <EnrollmentLayout id="registro">
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
                    Back
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

export default Registro;
