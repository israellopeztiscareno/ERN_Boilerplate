// Dependencias
import { createSlice } from "@reduxjs/toolkit";

// HTTP Client Service
import HTTPService from "../../helpers/api/api.client";

import { asyncThunkHandleError } from "../../helpers/utils";

/**
 * Response
 */

interface UserResponse {
  role: "Admin" | "User";
}

/**
 * Initial state
 */

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

const initialState: User = {};

export const usersGet = asyncThunkHandleError<undefined, UserResponse>(
  "users/get",
  async () => await HTTPService("POST", "/api/users/get"),
);

export const userLogout = asyncThunkHandleError<undefined, undefined>(
  "users/logout",
  async () => await HTTPService("POST", "/auth/logout"),
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(usersGet.fulfilled, (state, action) => {
      const { role } = action.payload;

      state.role = role;
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.id = undefined;
      state.name = undefined;
      state.email = undefined;
      state.role = undefined;
    });
  },
});

export default userSlice;
