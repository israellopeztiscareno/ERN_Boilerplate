// Dependencias
import React from "react";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";

// Wrapper
import { renderWithProvider } from "../../helpers/test-utils";

// Container
import ActualizarContrasena from "../../containers/ActualizarContrasena";

// API Client
import { api } from "../../helpers/api/api.client";

const mock = new MockAdapter(api, { onNoMatch: "throwException" });

describe("Actualizar Contraseña", () => {
  const user = userEvent.setup();

  const renderComponent = () => {
    return renderWithProvider(
      ActualizarContrasena,
      {
        state: {},
      },
      { initialEntries: ["/actualizar-contrasena/12345678"] },
    );
  };

  it("Fill form, submit and get a SUCESS response from service", async () => {
    mock
      .onPost("/auth/update-password")
      .reply(200, { message: "Success actualizar contraseña" });

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(
      screen.getByText("Actualizar contraseña", { selector: "button" }),
    ).toBeDisabled();

    /**
     * Invalid field
     */

    await user.type(
      screen.getByTestId("actualizar_contrasena__password"),
      "Int3rW4r3.2023!",
    );

    await user.type(
      screen.getByTestId("actualizar_contrasena__confirmPassword"),
      "Int3rW4r3.2022!",
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("actualizar_contrasena__confirmPassword"),
      ).toHaveValue("Int3rW4r3.2022!");
    });

    await user.clear(
      screen.getByTestId("actualizar_contrasena__confirmPassword"),
    );

    /**
     * Filling the form
     */
    await user.type(
      screen.getByTestId("actualizar_contrasena__confirmPassword"),
      "Int3rW4r3.2023!",
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("actualizar_contrasena__confirmPassword"),
      ).toHaveProperty("value", "Int3rW4r3.2023!");
    });

    /**
     * Submit button not disabled
     */
    expect(
      screen.getByText("Actualizar contraseña", {
        selector: "button",
      }),
    ).not.toBeDisabled();

    /**
     * Submit
     */
    await user.click(
      screen.getByText("Actualizar contraseña", { selector: "button" }),
    );
  });

  it("Fill form, submit and get an ERROR response from service", async () => {
    mock.onPost("/auth/update-password").networkError();

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(
      screen.getByText("Actualizar contraseña", { selector: "button" }),
    ).toBeDisabled();

    /**
     * Filling the form
     */
    await user.type(
      screen.getByTestId("actualizar_contrasena__password"),
      "Int3rW4r3.2023!",
    );

    await user.type(
      screen.getByTestId("actualizar_contrasena__confirmPassword"),
      "Int3rW4r3.2023!",
    );

    await waitFor(() => {
      /**
       * Submit button not disabled
       */
      expect(
        screen.getByText("Actualizar contraseña", {
          selector: "button",
        }),
      ).not.toBeDisabled();
    });

    /**
     * Submit
     */
    await user.click(
      screen.getByText("Actualizar contraseña", { selector: "button" }),
    );
  });
});
