import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  authService: {
    logout: vi.fn(),
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

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "jwt-token");
  });

  it("calls authService.logout on success without redirecting", async () => {
    vi.mocked(authService.logout).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    expect(authService.logout).toHaveBeenCalledOnce();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("does not redirect on error", async () => {
    vi.mocked(authService.logout).mockRejectedValueOnce(
      new Error("Não autorizado"),
    );

    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
