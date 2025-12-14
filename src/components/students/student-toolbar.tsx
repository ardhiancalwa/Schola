"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentToolbarProps {
  classes: { id: string; label: string }[];
  selectedClassId: string;
  onClassChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function StudentToolbar({
  classes,
  selectedClassId,
  onClassChange,
  searchQuery,
  onSearchChange,
}: StudentToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Temukan siswa berdasarkan Nama atau NIS"
          className="pl-10 rounded-full border-slate-300 bg-white"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select value={selectedClassId} onValueChange={onClassChange}>
          <SelectTrigger className="rounded-full border-slate-300 bg-white">
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
