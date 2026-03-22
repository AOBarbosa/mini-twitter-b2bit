import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/forms/login-form.tsx";
import { useLogin } from "@/hooks/useLogin";

vi.mock("@/hooks/useLogin");

const mockMutate = vi.fn();

function mockUseLogin(overrides = {}) {
  vi.mocked(useLogin).mockReturnValue({
    mutate: mockMutate,
    isPending: false,
    error: null,
    ...overrides,
  } as ReturnType<typeof useLogin>);
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLogin();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Insira o seu e-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Insira a sua senha")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText("Insira o seu e-mail"), "invalido");
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByText("E-mail inválido")).toBeInTheDocument();
  });

  it("shows validation error for empty password", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText("Insira o seu e-mail"), "user@email.com");
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByText("Senha obrigatória")).toBeInTheDocument();
  });

  it("calls mutate with correct data on submit", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText("Insira o seu e-mail"), "user@email.com");
    await userEvent.type(screen.getByPlaceholderText("Insira a sua senha"), "1234");
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: "user@email.com",
        password: "1234",
      });
    });
  });

  it("displays API error message", () => {
    mockUseLogin({ error: new Error("Credenciais inválidas") });
    render(<LoginForm />);
    expect(screen.getByText("E-mail ou senha inválidos.")).toBeInTheDocument();
  });

  it("disables button and shows 'Entrando...' while loading", () => {
    mockUseLogin({ isPending: true });
    render(<LoginForm />);
    const button = screen.getByRole("button", { name: "Entrando..." });
    expect(button).toBeDisabled();
  });

  it("toggles password visibility when eye icon is clicked", async () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText("Insira a sua senha");
    expect(input).toHaveAttribute("type", "password");

    const eyeButton = screen.getByRole("button", { name: "" });
    await userEvent.click(eyeButton);
    expect(input).toHaveAttribute("type", "text");
  });
});
