"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface ReportHeaderProps {
  classes: { id: string; label: string }[]; // Simplified label
  // Or match whatever getAllClasses returns.
}

export function ReportHeader({ classes }: ReportHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentClassId =
    searchParams.get("classId") || (classes.length > 0 ? classes[0].id : "");
  const currentSemester = searchParams.get("semester") || "Ganjil";

  const handleClassChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("classId", val);
    router.push(`?${params.toString()}`);
  };

  const handleSemesterChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("semester", val);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral">
          Analitik Pembelajaran
        </h2>
        <p className="text-slate-500 text-sm">
          Pantau perkembangan belajar siswa Anda dengan cepat dan mudah.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={currentSemester} onValueChange={handleSemesterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ganjil">Semester Ganjil</SelectItem>
              <SelectItem value="Genap">Semester Genap</SelectItem>
            </SelectContent>
          </Select>

          {/* Removed Subject Filter - merged into Class/Mapel selection as per prompt */}
          {/* User said "Class (which implies Subject)" */}

          <Select value={currentClassId} onValueChange={handleClassChange}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action */}
        <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white gap-2">
          Ekspor Data
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
