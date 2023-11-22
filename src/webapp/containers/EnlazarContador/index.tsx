// Dependencias
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { FormikHelpers } from "formik";
import type { AppDispatch, RootState } from "../../store";

// Componentes
import Form from "../../components/EnlazarContador/Form";
import Profile from "../../components/EnlazarContador/Profile";

import type { SearchFormValues } from "../../components/EnlazarContador/Form";

import {
  accountantGetByUsername,
  accountantLink,
  accountantLinked,
  accountantRemove,
} from "../../store/reducers/accountant";

const EnlazarContador = () => {
  const [accountantStr, setAccountant] = useState<string>("");

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const { linkedAccountant, accountant } = useSelector(
    (state: RootState) => state.accountant,
  );

  const handleSearch = (
    values: SearchFormValues,
    { resetForm }: FormikHelpers<SearchFormValues>,
  ) => {
    dispatch(accountantGetByUsername(values.username));
    setAccountant(values.username);
    resetForm();
  };

  const onSubmit = async () => {
    const res = await dispatch(accountantLink(accountantStr));

    if (res.meta.requestStatus !== "rejected") {
      await dispatch(accountantLinked());
      navigate("/inicio");
    }
  };

  const onRemove = async () => {
    const res = await dispatch(accountantRemove());

    if (res.meta.requestStatus !== "rejected") {
      navigate("/inicio");
    }
  };

  return (
    <section id="enlazar-contador" className="mt-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1>Link accountant</h1>
        <div className="d-flex gap-3">
          <Form onSubmit={handleSearch} />
        </div>
      </div>
      {accountant || linkedAccountant ? (
        <Profile handleSubmit={onSubmit} handleRemove={onRemove} />
      ) : (
        <div>
          <p>Enter the accountant's username and click search</p>
        </div>
      )}
    </section>
  );
};

export default EnlazarContador;
