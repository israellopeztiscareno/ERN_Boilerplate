// Dependencias
import { createSlice } from "@reduxjs/toolkit";

type ModalProps = {
  open: boolean;
};

const initialState: ModalProps = { open: false };

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.open = true;
    },
    closeModal: (state) => {
      state.open = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice;
