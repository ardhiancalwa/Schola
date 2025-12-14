"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NumericPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function NumericPagination({
  currentPage,
  totalPages,
}: NumericPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-1.5 mt-6">
      <p className="text-sm text-slate-500 mr-4">
        Menampilkan halaman {currentPage} dari {totalPages}
      </p>

      <Button
        size="icon"
        variant="ghost"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="h-8 w-8 text-slate-400 rounded-lg hover:bg-slate-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((p) => {
        // Show limited pages if too many? For now show all or simple slice if needed.
        // User requested [1, 2, 3...] simple numeric.
        if (totalPages > 7) {
          // Basic logic to show start, end, and current window, but let's stick to simple list for < 10 pages for now
          // or standard rendering. I'll render all if < 8, otherwise ellipsis logic could be added but simple is requested.
        }

        return (
          <Button
            key={p}
            size="icon"
            onClick={() => handlePageChange(p)}
            className={cn(
              "h-8 w-8 rounded-full text-sm font-medium transition-all shadow-sm",
              currentPage === p
                ? "bg-[#317C74] text-white hover:bg-[#2A6B63] shadow-teal-700/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
            )}
          >
            {p}
          </Button>
        );
      })}

      <Button
        size="icon"
        variant="ghost"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="h-8 w-8 text-slate-400 rounded-lg hover:bg-slate-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
