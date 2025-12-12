"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function ReportHeader() {
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
          <Select className="w-[180px]">
            <option>Semester Ganjil</option>
            <option>Semester Genap</option>
          </Select>
          <Select className="w-[180px]">
            <option>Matematika</option>
            <option>Biologi</option>
            <option>Fisika</option>
          </Select>
          <Select className="w-[180px]">
            <option>X A</option>
            <option>XI A</option>
            <option>XII A</option>
          </Select>
        </div>

        {/* Action */}
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
          Ekspor Data
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
