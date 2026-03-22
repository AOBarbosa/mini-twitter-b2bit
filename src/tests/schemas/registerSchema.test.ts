import { describe, it, expect } from "vitest";
import { registerSchema } from "@/schemas/registerSchema";

describe("registerSchema", () => {
  it("validates correct data", () => {
    const result = registerSchema.safeParse({
      name: "André",
      email: "andre@email.com",
      password: "1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "andre@email.com",
      password: "1234",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Nome deve ter no mínimo 2 caracteres"
      );
    }
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "André",
      email: "nao-e-email",
      password: "1234",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("E-mail inválido");
    }
  });

  it("rejects password shorter than 4 characters", () => {
    const result = registerSchema.safeParse({
      name: "André",
      email: "andre@email.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Senha deve ter no mínimo 4 caracteres"
      );
    }
  });

  it("rejects missing fields", () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
