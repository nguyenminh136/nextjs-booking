import { Suspense } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SectionCardSkeleton } from "@/components/skeletons/section-card.skeleton";

import data from "./data.json";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Suspense fallback={<SectionCardSkeleton />}>
            <SectionCards />
          </Suspense>
          <ChartAreaInteractive />
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
