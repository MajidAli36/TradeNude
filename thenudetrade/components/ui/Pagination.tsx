"use client";

import Button from "./Button";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-300">
      <span>
        Page {page} of {pageCount}
      </span>
      <div className="flex gap-2">
        <Button
          variant="subtle"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="subtle"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
