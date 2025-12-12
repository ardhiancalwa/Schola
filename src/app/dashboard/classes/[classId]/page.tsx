"use client";

import { GraduationCap, Users, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassStats } from "@/components/classes/class-stats";
import { GradeTable } from "@/components/classes/grade-table";

export default function ClassDetailPage() {
  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Kelas</h1>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-neutral">Matematika</h2>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Kelas XI A
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> 40 Siswa
              </span>
            </div>
          </div>
        </div>

        <div className="self-start md:self-end">
          <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white gap-2 font-semibold">
            Ekspor Data <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div>
        <ClassStats />
        <GradeTable />
      </div>
    </div>
  );
}
