import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../api/fakeStoreApi", () => ({
  login: vi.fn(),
}));

import { login as apiLogin } from "../api/fakeStoreApi";

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Login page", () => {
  beforeEach(() => {
    sessionStorage.clear();
    apiLogin.mockReset();
  });

  it("pre-fills the demo credentials", () => {
    renderLogin();
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toHaveValue("mor_2314");
  });

  it("stores the token in sessionStorage on successful login", async () => {
    apiLogin.mockResolvedValueOnce("fake.jwt.token");
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("token")).toBe("fake.jwt.token");
    });
  });

  it("shows an error message on invalid credentials (401)", async () => {
    apiLogin.mockRejectedValueOnce({ response: { status: 401 } });
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/identifiants invalides/i);
    expect(sessionStorage.getItem("token")).toBeNull();
  });
});
