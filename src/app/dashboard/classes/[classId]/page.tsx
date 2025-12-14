"use client";

import { GraduationCap, Users, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassStats } from "@/components/classes/class-stats";
import { GradeTable } from "@/components/classes/grade-table";
import Link from "next/link";
import { use } from "react";

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = use(params);

  return (
    <div className="space-y-8 font-sans pb-20 p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-neutral">Kelas</h1>

        {/* Sub Header / Class Title Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-neutral">Matematika</h2>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Kelas XI A</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> 40 Siswa
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Material Insight Button */}
            <Link href={`/dashboard/classes/${classId}/materials/1/summary`}>
              <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white gap-2 font-semibold rounded-full px-6 shadow-md shadow-teal-700/20">
                Ringkasan & Insight Materi <Sparkles className="w-4 h-4" />
              </Button>
            </Link>

            {/* Export Button (Secondary) */}
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:text-[#317C74] gap-2 font-semibold rounded-full"
            >
              Ekspor Data <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <ClassStats />
        <GradeTable />
      </div>
    </div>
  );
}
