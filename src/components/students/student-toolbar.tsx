"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function StudentToolbar() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Temukan siswa berdasarkan Nama atau NIS"
          className="pl-10 rounded-full border-slate-300 bg-white"
        />
      </div>
      <div className="w-full sm:w-[150px]">
        <Select className="rounded-full border-slate-300 bg-white">
          <option>X A</option>
          <option>X B</option>
          <option>XI A</option>
        </Select>
      </div>
    </div>
  );
}
