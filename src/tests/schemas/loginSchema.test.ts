import { describe, it, expect } from "vitest";
import { loginSchema } from "@/schemas/loginSchema";

describe("loginSchema", () => {
  it("validates correct data", () => {
    const result = loginSchema.safeParse({
      email: "user@email.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "email-invalido",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("E-mail inválido");
    }
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@email.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Senha obrigatória");
    }
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
