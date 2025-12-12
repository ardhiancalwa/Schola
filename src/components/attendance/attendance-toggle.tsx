"use client";

import { Check, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type AttendanceStatus = "hadir" | "alpha" | "izin" | null;

interface AttendanceToggleProps {
  status: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void;
}

export function AttendanceToggle({
  status,
  onStatusChange,
}: AttendanceToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Hadir Button */}
      <button
        onClick={() => onStatusChange("hadir")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium min-w-[100px] justify-center",
          status === "hadir"
            ? "bg-[#317C74] text-white border-[#317C74]"
            : "bg-white text-slate-500 border-slate-200 hover:border-[#317C74] hover:text-[#317C74]"
        )}
      >
        <Check className="w-4 h-4" />
        Hadir
      </button>

      {/* Alpha Button */}
      <button
        onClick={() => onStatusChange("alpha")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium min-w-[100px] justify-center",
          status === "alpha"
            ? "bg-[#F64C4C] text-white border-[#F64C4C]"
            : "bg-white text-slate-500 border-slate-200 hover:border-[#F64C4C] hover:text-[#F64C4C]"
        )}
      >
        <X className="w-4 h-4" />
        Alpha
      </button>

      {/* Izin Button */}
      <button
        onClick={() => onStatusChange("izin")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium min-w-[100px] justify-center",
          status === "izin"
            ? "bg-[#FFA102] text-white border-[#FFA102]"
            : "bg-white text-slate-500 border-slate-200 hover:border-[#FFA102] hover:text-[#FFA102]"
        )}
      >
        <FileText className="w-4 h-4" />
        Izin
      </button>
    </div>
  );
}
