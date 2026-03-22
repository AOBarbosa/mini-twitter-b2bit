"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];
    const siblings = 1;

    pages.push(1);

    const leftSibling = Math.max(2, page - siblings);
    const rightSibling = Math.min(totalPages - 1, page + siblings);

    if (leftSibling > 2) {
      pages.push("...");
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    if (rightSibling < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-full text-text-secondary-dark hover:text-primary-white hover:bg-text-secondary-dark/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageNumbers.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-text-secondary-dark text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
              p === page
                ? "bg-primary-blue text-primary-white"
                : "text-text-secondary-dark hover:text-primary-white hover:bg-text-secondary-dark/20"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-full text-text-secondary-dark hover:text-primary-white hover:bg-text-secondary-dark/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
