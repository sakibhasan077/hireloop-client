"use client";

import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

type FilterOption = {
  id: string;
  label: string;
  count: number;
};

type FilterGroup = {
  title: string;
  name: string;
  type: "radio" | "checkbox";
  options: FilterOption[];
};

const filterGroups: FilterGroup[] = [
  {
    title: "Job Type",
    name: "jobType",
    type: "radio",
    options: [
      { id: "job-type-full-time", label: "Full-time", count: 124 },
      { id: "job-type-contract", label: "Contract", count: 57 },
      { id: "job-type-part-time", label: "Part-time", count: 38 },
      { id: "job-type-internship", label: "Internship", count: 21 },
    ],
  },
  {
    title: "Job Category",
    name: "jobCategory",
    type: "radio",
    options: [
      {
        id: "job-category-engineering",
        label: "Engineering & Tech",
        count: 146,
      },
      { id: "job-category-design", label: "Design", count: 62 },
      { id: "job-category-product", label: "Product", count: 48 },
      { id: "job-category-marketing", label: "Marketing", count: 39 },
      { id: "job-category-sales", label: "Sales", count: 51 },
      { id: "job-category-finance", label: "Finance", count: 27 },
      {
        id: "job-category-human-resources",
        label: "Human Resources",
        count: 18,
      },
      { id: "job-category-operations", label: "Operations", count: 33 },
      { id: "job-category-other", label: "Other", count: 24 },
    ],
  },
];

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Get all existing query parameters
    const params = new URLSearchParams(searchParams.toString());

    // Update only the selected filter
    params.set(e.target.name, e.target.value);

    router.push(`/brows-jobs?${params.toString()}`);
  };

  return (
    <Card className="h-fit gap-5 bg-[#121214] p-4 ring-white/10 lg:sticky lg:top-24">
      <h2 className="text-sm font-semibold text-white">Filters</h2>

      <div className="space-y-5">
        {filterGroups.map((group) => (
          <fieldset key={group.name} className="min-w-0">
            <legend className="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {group.title}
            </legend>

            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {group.options.map((option) => (
                <li key={option.id}>
                  <label
                    htmlFor={option.id}
                    className="flex cursor-pointer items-center gap-2.5 text-[13px] text-muted-foreground transition-colors hover:text-white"
                  >
                    <input
                      id={option.id}
                      name={group.name}
                      onChange={handleRadioChange}
                      type={group.type}
                      value={option.label}
                      checked={
                        searchParams.get(group.name) === option.label
                      }
                      className="size-3.5 shrink-0 cursor-pointer accent-[#5C53FE]"
                    />

                    <span className="flex-1">{option.label}</span>

                    <span className="text-[11px] text-white/35">
                      {option.count}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>
    </Card>
  );
}
