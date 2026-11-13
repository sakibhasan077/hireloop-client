"use client"
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function JobSearchBar() {

  return (
    // Search is visual only for now.
    // Wrap the input in a <form> and connect it to the query string later.
    <form>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            aria-label="Search jobs"
            name="search"
            placeholder="Search by job title..."
            className="h-11 rounded-lg border-white/10 bg-[#121214] pr-16 pl-10 text-sm text-white placeholder:text-muted-foreground focus-visible:border-[#5C53FE]/60 focus-visible:ring-[#5C53FE]/20 dark:bg-[#121214]"
          />
        </div>

        <Button
          type="submit"
          className="h-11 shrink-0 rounded-lg bg-white px-5 text-sm font-medium text-black hover:bg-white/90"
        >
          Post A Job
        </Button>
      </div>
    </form>
  );
}
