import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin } from "@/hooks/useLogin";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  authService: {
    login: vi.fn(),
  },
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("saves token and redirects to /feed on success", async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      token: "jwt-token",
      user: { id: 1, name: "André", email: "andre@email.com" },
    });

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: "andre@email.com", password: "1234" });
    });

    expect(localStorage.getItem("token")).toBe("jwt-token");
    expect(mockPush).toHaveBeenCalledWith("/feed");
  });

  it("does not redirect on error", async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(
      new Error("Credenciais inválidas")
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: "x@x.com", password: "errado" });
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
