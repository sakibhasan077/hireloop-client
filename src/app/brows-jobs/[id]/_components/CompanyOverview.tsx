import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { JobPost } from "../../_components/types";

export function CompanyOverview({ job }: { job: JobPost }) {
  return (
    <aside className="lg:sticky lg:top-24">
      <Card className="gap-0 overflow-hidden bg-[#121214] py-0 ring-white/10">
        <div className="p-4 pb-3">
          <h2 className="text-sm font-semibold text-white">
            Company Overview
          </h2>
        </div>

        {/* TODO: replace this placeholder with the company cover image when it
            is available from the API. */}
        <div className="px-4 pb-4">
          <div className="flex h-36 items-center justify-center rounded-lg border border-white/5 bg-gradient-to-br from-[#1e1e24] via-[#141417] to-[#0c0c0e]">
            <Building2 className="size-8 text-white/20" />
          </div>
        </div>

        <Separator className="bg-white/10" />

        <dl className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Size
            </dt>
            {/* TODO: add a companySize field to the company/job model. */}
            <dd className="text-right text-xs font-medium text-white">
              Not specified
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Industry
            </dt>
            <dd className="text-right text-xs font-medium text-white">
              {job.jobCategory}
            </dd>
          </div>
        </dl>

        <div className="px-4 pb-4">
          {/* TODO: link this button to the company website when a website field
              is available. */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            Visit Website
          </Button>
        </div>
      </Card>
    </aside>
  );
}
