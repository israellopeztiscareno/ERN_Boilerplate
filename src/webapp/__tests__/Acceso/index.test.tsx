// Dependencias
import React from "react";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";

// Wrapper
import { renderWithProvider } from "../../helpers/test-utils";

// Container
import Acceso from "../../containers/Acceso";

// API Client
import { api } from "../../helpers/api/api.client";

const mock = new MockAdapter(api, { onNoMatch: "throwException" });

describe("Acceso", () => {
  const user = userEvent.setup();

  const renderComponent = () => {
    return renderWithProvider(<Acceso />, {});
  };

  it("Fill form, submit and get a SUCESS response from service", async () => {
    mock.onPost("/auth/login").reply(200, {
      user: { firstName: "Juan", email: "juandoe@juandoe.com" },
    });

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(screen.getByText("Submit", { selector: "button" })).toBeDisabled();

    /**
     * Filling the form
     */
    await user.type(screen.getByTestId("acceso__username"), "juandoe");
    await user.type(screen.getByTestId("acceso__password"), "#Int3rW4r.32021!");

    await waitFor(() => {
      expect(screen.getByTestId("acceso__username")).toHaveProperty(
        "value",
        "juandoe",
      );

      expect(screen.getByTestId("acceso__password")).toHaveProperty(
        "value",
        "#Int3rW4r.32021!",
      );
    });

    /**
     * Submit button not disabled
     */
    expect(
      screen.getByText("Submit", { selector: "button" }),
    ).not.toBeDisabled();

    /**
     * Submit
     */
    await user.click(screen.getByText("Submit", { selector: "button" }));
  });

  it("Fill form, submit and get an ERROR response from service", async () => {
    mock.onPost("/auth/login").networkError();

    renderComponent();

    /**
     * Submit button disabled
     */
    expect(screen.getByText("Submit", { selector: "button" })).toBeDisabled();

    /**
     * Filling the form
     */
    await user.type(screen.getByTestId("acceso__username"), "juandoe");
    await user.type(screen.getByTestId("acceso__password"), "#Int3rW4r.32021!");

    await waitFor(() => {
      expect(screen.getByTestId("acceso__username")).toHaveProperty(
        "value",
        "juandoe",
      );

      expect(screen.getByTestId("acceso__password")).toHaveProperty(
        "value",
        "#Int3rW4r.32021!",
      );
    });

    /**
     * Submit button not disabled
     */
    expect(
      screen.getByText("Submit", { selector: "button" }),
    ).not.toBeDisabled();

    /**
     * Submit
     */
    await user.click(screen.getByText("Submit", { selector: "button" }));
  });
});
