// Dependencias
import { createSlice } from "@reduxjs/toolkit";

import HTTPService from "../../helpers/api/api.client";

import { asyncThunkHandleError } from "../../helpers/utils";

type Cliente = {
  username: string;
  creationDate: string;
  email: string;
  firstName: string;
  lastName: string;
};

interface Users {
  users: Array<Cliente>;
}

const initialState: Users = {
  users: [],
};

export const usersGetAll = asyncThunkHandleError<
  undefined,
  { users: Array<Cliente> }
>("users/getAll", async () => await HTTPService("POST", "/api/users-get-all"));

const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(usersGetAll.fulfilled, (state, action) => {
      const { users } = action.payload;

      state.users = users;
    });
  },
});

export default userSlice;
