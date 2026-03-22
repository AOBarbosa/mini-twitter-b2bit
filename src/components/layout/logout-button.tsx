"use client";

import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      variant="ghost"
      onClick={() => logout()}
      disabled={isPending}
      className="text-primary-gray dark:text-text-secondary-dark hover:text-primary-red dark:hover:text-primary-red"
    >
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
