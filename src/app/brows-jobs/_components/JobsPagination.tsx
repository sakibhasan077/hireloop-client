import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const PAGES = [1, 2, 3];

// Visual placeholder — replace this with the current page from searchParams
// once pagination is wired up.
const CURRENT_PAGE = 1;

export function JobsPagination() {
  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        disabled
        aria-label="Previous page"
        className="flex size-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {PAGES.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === CURRENT_PAGE ? "page" : undefined}
          className={cn(
            "flex size-8 items-center justify-center rounded-md border text-xs font-medium transition-colors",
            page === CURRENT_PAGE
              ? "border-white bg-white text-black"
              : "border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        className="flex size-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
