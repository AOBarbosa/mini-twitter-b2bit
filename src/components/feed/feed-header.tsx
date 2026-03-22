"use client";

import { Search, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface FeedHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  isAuthenticated: boolean;
}

export function FeedHeader({
  search,
  onSearchChange,
  isAuthenticated,
}: FeedHeaderProps) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-secondary-blue border-b border-gray-200 dark:border-text-secondary-dark/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
        <div className="shrink-0 hidden sm:block">
          <span className="font-bold text-primary-blue text-lg">
            Mini Twitter
          </span>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-gray dark:text-text-secondary-dark" />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar posts..."
              className="w-full h-10 bg-white dark:bg-[#0F172B]/60 text-secondary-blue dark:text-primary-white placeholder:text-primary-gray dark:placeholder:text-text-secondary-dark pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-text-secondary-dark/20 focus:outline-none focus:border-primary-blue rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <button
              data-testid="logout-button"
              onClick={() => logout()}
              disabled={isPending}
              className="p-2 rounded-full border border-gray-200 dark:border-text-secondary-dark/30 text-primary-gray dark:text-text-secondary-dark hover:text-primary-red dark:hover:text-primary-red transition-colors disabled:opacity-60"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <>
              <Button
                variant="outline"
                asChild
                className="hidden sm:inline-flex w-39 text-secondary-blue dark:text-primary-white bg-transparent border-gray-300 dark:border-text-secondary-dark/40 rounded-full"
              >
                <Link
                  href="/login"
                  className="font-bold bg-transparent dark:bg-secondary-blue hover:bg-transparent/90 hover:text-primary-blue/90 dark:hover:bg-secondary-blue/90 dark:hover:text-primary-blue/90"
                >
                  Registrar-se
                </Link>
              </Button>
              <Button
                asChild
                className="w-39 bg-primary-blue text-primary-white rounded-full"
              >
                <Link
                  href="/login"
                  className="font-bold bg-primary-blue hover:bg-primary-blue/90"
                  data-testid="login-button"
                >
                  Login
                </Link>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
