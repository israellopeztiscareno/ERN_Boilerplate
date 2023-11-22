// Dependencias
import { createSlice } from "@reduxjs/toolkit";

import HTTPService from "../../helpers/api/api.client";

import { asyncThunkHandleError } from "../../helpers/utils";

import type { FormValues as LoginFormvalues } from "../../components/Acceso/Form";
import type { FormValues as RegistroFormvalues } from "../../components/Registro/Form";

/**
 * Response
 */

type Roles = {
  roles: Array<string>;
};

interface UserResponse {
  name: string;
  email: string;
  realm_access: Roles;
}

/**
 * Initial state
 */

interface User {
  name?: string;
  email?: string;
  role?: string;
}

const initialState: User = {};

export const userLogin = asyncThunkHandleError<LoginFormvalues, UserResponse>(
  "user/login",
  async (formValues) => await HTTPService("POST", "/auth/login", formValues),
);

export const userLogout = asyncThunkHandleError<undefined, undefined>(
  "user/logout",
  async () => await HTTPService("POST", "/auth/logout"),
);

export const userRegister = asyncThunkHandleError<RegistroFormvalues, {}>(
  "user/register",
  async (formValues) => await HTTPService("POST", "/auth/register", formValues),
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      const { name, email, realm_access } = action.payload;

      const role = realm_access.roles.includes("accountant")
        ? "accountant"
        : "user";

      state.name = name;
      state.email = email;
      state.role = role;
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.name = "";
      state.email = "";
      state.role = "";
    });
  },
});

export default userSlice;
