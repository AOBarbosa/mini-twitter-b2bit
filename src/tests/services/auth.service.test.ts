import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@/services/auth.service";
import { api } from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  api: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(api.post);

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("returns token and user on success", async () => {
      const mockResponse = {
        data: {
          token: "jwt-token",
          user: { id: 1, name: "André", email: "andre@email.com" },
        },
      };
      mockedPost.mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        email: "andre@email.com",
        password: "1234",
      });

      expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
        email: "andre@email.com",
        password: "1234",
      });
      expect(result.token).toBe("jwt-token");
      expect(result.user.name).toBe("André");
    });

    it("throws error on invalid credentials", async () => {
      mockedPost.mockRejectedValueOnce(new Error("Credenciais inválidas"));

      await expect(
        authService.login({ email: "x@x.com", password: "errado" })
      ).rejects.toThrow("Credenciais inválidas");
    });
  });

  describe("register", () => {
    it("returns created user data on success", async () => {
      const mockResponse = {
        data: { id: 1, name: "André", email: "andre@email.com" },
      };
      mockedPost.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        name: "André",
        email: "andre@email.com",
        password: "1234",
      });

      expect(mockedPost).toHaveBeenCalledWith("/auth/register", {
        name: "André",
        email: "andre@email.com",
        password: "1234",
      });
      expect(result.id).toBe(1);
    });

    it("throws error when user already exists", async () => {
      mockedPost.mockRejectedValueOnce(
        new Error("Usuário já cadastrado ou dados inválidos")
      );

      await expect(
        authService.register({
          name: "André",
          email: "andre@email.com",
          password: "1234",
        })
      ).rejects.toThrow("Usuário já cadastrado ou dados inválidos");
    });
  });

  describe("logout", () => {
    it("calls the endpoint and removes token from localStorage", async () => {
      mockedPost.mockResolvedValueOnce({ data: { success: true } });
      localStorage.setItem("token", "jwt-token");

      await authService.logout();

      expect(mockedPost).toHaveBeenCalledWith("/auth/logout");
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
