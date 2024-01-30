// Dependencias
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "../../store/reducers/modal";

import type { AppDispatch, RootState } from "../../store";

const Modal = () => {
  const toastRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { open } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    /**
     * Div Element
     */
    const toastElement = toastRef.current;

    if (typeof window !== "undefined") {
      toastElement?.addEventListener("hidden.bs.toast", () => {
        dispatch(closeModal());
      });
    }

    if (typeof window !== "undefined" && open) {
      const bootstrap = require("bootstrap");
      const toastBootstrap = new bootstrap.Toast(toastElement);
      toastBootstrap.show();
    }
  }, [open]);

  return (
    <>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          className="toast align-items-center text-bg-danger border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          ref={toastRef}
        >
          <div className="d-flex">
            <div className="toast-body">
              ¡Some error occurred try again later!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
