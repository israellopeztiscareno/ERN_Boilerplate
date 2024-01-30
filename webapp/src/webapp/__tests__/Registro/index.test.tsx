// Dependencias
import React from "react";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";

// Wrapper
import { renderWithProvider } from "../../helpers/test-utils";

// Container
import Registro from "../../containers/Registro";

// API Client
import { api } from "../../helpers/api/api.client";

const mock = new MockAdapter(api, { onNoMatch: "throwException" });

describe("Registro", () => {
  const user = userEvent.setup();

  const renderComponent = () => {
    return renderWithProvider(<Registro />, { state: {} });
  };

  it("Fill form, submit and get a SUCESS response from service", async () => {
    mock.onPost("/auth/register").reply(200, { message: "Success registro" });

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(screen.getByText("Register", { selector: "button" })).toBeDisabled();

    /**
     * Touch fields for error messages
     */

    await user.click(screen.getByTestId("registro__name"));
    await user.click(screen.getByTestId("registro__lastName"));
    await user.click(screen.getByTestId("registro__username"));
    await user.click(screen.getByTestId("registro__email"));
    await user.click(screen.getByTestId("registro__password"));
    await user.click(screen.getByTestId("registro__repeatPassword"));

    /**
     * Filling the form
     */
    await user.type(screen.getByTestId("registro__name"), "Juan");
    await user.type(screen.getByTestId("registro__lastName"), "Doe");
    await user.type(screen.getByTestId("registro__username"), "juandoe");
    await user.type(
      screen.getByTestId("registro__email"),
      "juandoe@juandoe.com",
    );
    await user.type(
      screen.getByTestId("registro__password"),
      "Int3rW4r3.2023!",
    );
    await user.type(
      screen.getByTestId("registro__repeatPassword"),
      "Int3rW4r3.2023!",
    );
    await user.click(screen.getByLabelText("¡I'm accountant!"));

    await user.click(screen.getByTestId("registro__profile"));

    await waitFor(() => {
      expect(screen.getByLabelText("¡I'm accountant!")).toBeChecked();
    });

    await user.type(
      screen.getByTestId("registro__profile"),
      "Este es el perfil",
    );

    await waitFor(() => {
      expect(screen.getByTestId("registro__profile")).toHaveValue(
        "Este es el perfil",
      );
    });

    /**
     * Submit button not disabled
     */
    expect(
      screen.getByText("Register", { selector: "button" }),
    ).not.toBeDisabled();

    /**
     * Submit
     */
    await user.click(screen.getByText("Register", { selector: "button" }));
  });

  it("Fill form, submit and get an ERROR response from service", async () => {
    mock.onPost("/auth/register").networkError();

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(screen.getByText("Register", { selector: "button" })).toBeDisabled();

    /**
     * Filling the form
     */
    await user.type(screen.getByTestId("registro__name"), "Juan");
    await user.type(screen.getByTestId("registro__lastName"), "Doe");
    await user.type(screen.getByTestId("registro__username"), "juandoe");
    await user.type(
      screen.getByTestId("registro__email"),
      "juandoe@juandoe.com",
    );
    await user.type(
      screen.getByTestId("registro__password"),
      "Int3rW4r3.2023!",
    );
    await user.type(
      screen.getByTestId("registro__repeatPassword"),
      "Int3rW4r3.2023!",
    );

    await waitFor(() => {
      /**
       * Submit button not disabled
       */
      expect(
        screen.getByText("Register", { selector: "button" }),
      ).not.toBeDisabled();
    });

    /**
     * Submit
     */
    await user.click(screen.getByText("Register", { selector: "button" }));
  });
});
