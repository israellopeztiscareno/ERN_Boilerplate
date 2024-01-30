// Dependencias
import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";

// Modal
import { openModal } from "../store/reducers/modal";

type ThunkApiConfig = {
  dispatch: Function;
  rejectWithValue: (value: any) => any;
};

export const asyncThunkHandleError = <Arg = {}, Return = any>(
  typePrefix: string,
  thunk: (arg: Arg, thunkAPI: ThunkApiConfig) => Promise<Return>,
) =>
  createAsyncThunk<Return, Arg, { rejectValue: SerializedError }>(
    typePrefix,
    async (arg, thunkAPI) => {
      try {
        return await thunk(arg, thunkAPI);
      } catch (error: any) {
        /**
         * Send message error modal
         */
        thunkAPI.dispatch(openModal());

        return thunkAPI.rejectWithValue(error.response?.data);
      }
    },
  );
