import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegister } from "@/hooks/useRegister";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
  },
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSetAuth = vi.fn();
vi.mock("@/store/authStore", () => ({
  useAuthStore: (sel: (s: object) => unknown) =>
    sel({ setAuth: mockSetAuth }),
}));

const mockHydrateLikes = vi.fn();
vi.mock("@/store/likedPostsStore", () => ({
  useLikedPostsStore: (sel: (s: object) => unknown) =>
    sel({ hydrate: mockHydrateLikes }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /feed on success", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      id: 1,
      name: "André",
      email: "andre@email.com",
    });
    vi.mocked(authService.login).mockResolvedValueOnce({
      token: "fake-token",
      user: { id: 1, name: "André", email: "andre@email.com" },
    });

    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      result.current.mutate({
        name: "André",
        email: "andre@email.com",
        password: "1234",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/feed");
  });

  it("does not redirect on error", async () => {
    vi.mocked(authService.register).mockRejectedValueOnce(
      new Error("Usuário já cadastrado")
    );

    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      result.current.mutate({
        name: "André",
        email: "andre@email.com",
        password: "1234",
      });
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
