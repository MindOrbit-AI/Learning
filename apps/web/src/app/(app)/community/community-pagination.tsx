"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@mindorbit/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

export function CommunityPagination({
  totalCount,
  currentPage,
}: {
  totalCount: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function goToPage(page: number) {
    const next = new URLSearchParams(searchParams?.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    router.push(`/community?${next}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
