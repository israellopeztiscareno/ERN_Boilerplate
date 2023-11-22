// Dependencias
import React from "react";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";

// Wrapper
import { renderWithProvider } from "../../helpers/test-utils";

// Container
import RecuperarContrasena from "../../containers/RecuperarContrasena";

// API Client
import { api } from "../../helpers/api/api.client";

const mock = new MockAdapter(api, { onNoMatch: "throwException" });

describe("Recuperar Contraseña", () => {
  const user = userEvent.setup();

  const renderComponent = () => {
    return renderWithProvider(<RecuperarContrasena />, {
      state: {},
    });
  };

  it("Fill form, submit and get a SUCESS response from service", async () => {
    mock
      .onPost("/auth/reset-password")
      .reply(200, { message: "Success recuperar contraseña" });

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(
      screen.getByText("Enviar correo de recuperación", { selector: "button" }),
    ).toBeDisabled();

    /**
     * Invalid field
     */

    await user.click(screen.getByTestId("recuperar_contrasena__email"));

    /**
     * Filling the form
     */
    await user.type(
      screen.getByTestId("recuperar_contrasena__email"),
      "juandoe@correo.com",
    );

    await waitFor(() => {
      expect(screen.getByTestId("recuperar_contrasena__email")).toHaveProperty(
        "value",
        "juandoe@correo.com",
      );

      /**
       * Submit button not disabled
       */
      expect(
        screen.getByText("Enviar correo de recuperación", {
          selector: "button",
        }),
      ).not.toBeDisabled();
    });

    /**
     * Submit
     */
    await user.click(
      screen.getByText("Enviar correo de recuperación", { selector: "button" }),
    );
  });

  it("Fill form, submit and get an ERROR response from service", async () => {
    mock.onPost("/auth/reset-password").networkError();

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(
      screen.getByText("Enviar correo de recuperación", { selector: "button" }),
    ).toBeDisabled();

    /**
     * Filling the form
     */
    await user.type(
      screen.getByTestId("recuperar_contrasena__email"),
      "juandoe@correo.com",
    );

    await waitFor(() => {
      /**
       * Submit button not disabled
       */
      expect(
        screen.getByText("Enviar correo de recuperación", {
          selector: "button",
        }),
      ).not.toBeDisabled();
    });

    /**
     * Submit
     */
    await user.click(
      screen.getByText("Enviar correo de recuperación", { selector: "button" }),
    );
  });
});
