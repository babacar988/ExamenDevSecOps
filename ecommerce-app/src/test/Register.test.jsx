import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";

vi.mock("../api/fakeStoreApi", () => ({
  registerUser: vi.fn(),
}));

import { registerUser } from "../api/fakeStoreApi";

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

async function fillForm(user, { password = "secret1", confirm = "secret1" } = {}) {
  await user.type(screen.getByLabelText(/nom d'utilisateur/i), "babs");
  await user.type(screen.getByLabelText(/e-mail/i), "babs@example.com");
  await user.type(screen.getByLabelText(/^mot de passe$/i), password);
  await user.type(screen.getByLabelText(/confirmer le mot de passe/i), confirm);
}

describe("Register page", () => {
  beforeEach(() => {
    registerUser.mockReset();
  });

  it("rejects a password shorter than 6 characters", async () => {
    const user = userEvent.setup();
    renderRegister();
    await fillForm(user, { password: "123", confirm: "123" });
    await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/au moins 6 caractères/i);
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("rejects mismatched password confirmation", async () => {
    const user = userEvent.setup();
    renderRegister();
    await fillForm(user, { password: "secret1", confirm: "secret2" });
    await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/ne correspondent pas/i);
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("calls registerUser with the form data on valid submit", async () => {
    registerUser.mockResolvedValueOnce({ id: 21 });
    const user = userEvent.setup();
    renderRegister();
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(registerUser).toHaveBeenCalledWith(
      expect.objectContaining({ username: "babs", email: "babs@example.com", password: "secret1" })
    );
  });

  it("shows an error message when the API call fails", async () => {
    registerUser.mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    renderRegister();
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/a échoué/i);
  });
});
