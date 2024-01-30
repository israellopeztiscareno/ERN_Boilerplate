// Dependencias
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import HTTPService from "../../helpers/api/api.client";

import { asyncThunkHandleError } from "../../helpers/utils";

type AccountantBase = {
  username: string;
  creationDate: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: string;
};

interface Accountant extends AccountantBase {
  type?: string;
}

interface AccountantState {
  accountant: Accountant | null;
  linkedAccountant: AccountantBase | null;
}

const initialState: AccountantState = {
  accountant: null,
  linkedAccountant: null,
};

export const accountantGetByUsername = asyncThunkHandleError(
  "accountant/getByUsername",
  async (username) =>
    await HTTPService("POST", "/api/accountant-get-by-username", { username }),
);

export const accountantLink = asyncThunkHandleError(
  "accountant/link",
  async (username) =>
    await HTTPService("POST", "/api/accountant-link", {
      username,
    }),
);

export const accountantLinked = asyncThunkHandleError<
  undefined,
  { username: string; linkedAccountant: AccountantBase }
>(
  "accountant/linked",
  async (username) =>
    await HTTPService("POST", "/api/accountant-linked", {
      username,
    }),
);

export const accountantRemove = asyncThunkHandleError<undefined, undefined>(
  "accountant/remove",
  async () => await HTTPService("POST", "/api/accountant-remove"),
);

const userSlice = createSlice({
  name: "accountant",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(accountantGetByUsername.fulfilled, (state, action) => {
      state.accountant = { ...action.payload };
    });
    builder.addCase(accountantLinked.fulfilled, (state, action) => {
      const { linkedAccountant } = action.payload;

      state.linkedAccountant = linkedAccountant;
    });
    builder.addCase(accountantRemove.fulfilled, (state, action) => {
      state.linkedAccountant = null;
    });
  },
});

export default userSlice;
