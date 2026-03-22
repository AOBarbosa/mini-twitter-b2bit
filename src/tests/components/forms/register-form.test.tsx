import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "@/components/forms/register-form";
import { useRegister } from "@/hooks/useRegister";

vi.mock("@/hooks/useRegister");

const mockMutate = vi.fn();

function mockUseRegister(overrides = {}) {
  vi.mocked(useRegister).mockReturnValue({
    mutate: mockMutate,
    isPending: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useRegister>);
}

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRegister();
  });

  it("renders name, email and password fields", () => {
    render(<RegisterForm />);
    expect(
      screen.getByPlaceholderText("Insira o seu nome"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Insira o seu e-mail"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Insira a sua senha"),
    ).toBeInTheDocument();
  });

  it("shows error for name shorter than 2 characters", async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByPlaceholderText("Insira o seu nome"), "A");
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(
      await screen.findByText("Nome deve ter no mínimo 2 caracteres"),
    ).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    render(<RegisterForm />);
    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu nome"),
      "André",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu e-mail"),
      "invalido",
    );
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByText("E-mail inválido")).toBeInTheDocument();
  });

  it("shows error for password shorter than 4 characters", async () => {
    render(<RegisterForm />);
    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu nome"),
      "André",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu e-mail"),
      "andre@email.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Insira a sua senha"),
      "123",
    );
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(
      await screen.findByText("Senha deve ter no mínimo 4 caracteres"),
    ).toBeInTheDocument();
  });

  it("calls mutate with correct data on submit", async () => {
    render(<RegisterForm />);
    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu nome"),
      "André",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Insira o seu e-mail"),
      "andre@email.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Insira a sua senha"),
      "1234",
    );
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "André",
        email: "andre@email.com",
        password: "1234",
      });
    });
  });

  it("displays API error message", () => {
    mockUseRegister({ error: new Error("Usuário já cadastrado") });
    render(<RegisterForm />);
    expect(
      screen.getByText("Usuário já cadastrado ou dados inválidos."),
    ).toBeInTheDocument();
  });

  it("disables button and shows 'Cadastrando...' while loading", () => {
    mockUseRegister({ isPending: true });
    render(<RegisterForm />);
    const button = screen.getByRole("button", { name: "Cadastrando..." });
    expect(button).toBeDisabled();
  });
});
