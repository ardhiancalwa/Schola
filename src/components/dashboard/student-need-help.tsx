"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumericPagination } from "@/components/classes/numeric-pagination";

interface StudentNeedHelpProps {
  students: {
    id: string;
    name: string;
    className: string;
    score: number;
    maxScore: number;
    taskSubmissionRate: number;
    percentage: number;
  }[];
  classList?: { id: string; name: string, department: string }[];
}

const ITEMS_PER_PAGE = 5;

export function StudentNeedHelp({
  students = [],
  classList = [],
}: StudentNeedHelpProps) {
  const [selectedClassId, setSelectedClassId] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState<"nilai" | "tugas">("nilai");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedClassId, activeTab]);

  const filteredStudents = React.useMemo(() => {
    let res = [...students];

    // 1. Filter by Class
    if (selectedClassId !== "all") {
      res = res.filter(
        (s) =>
          s.className === classList.find((c) => c.id === selectedClassId)?.name
      );
      // Wait, student object holds className string, but filter uses ID?
      // In dashboard.ts we passed className string.
      // So I should match className logic or id logic.
      // Current props only give className string not classId for student.
      // Better to use name match if IDs aren't on student object prop.
      // Or pass ID.
      // Check dashboard.ts: "className: s.classes?.name". No class ID passed explicitly in 'needsHelp' object.
      // So filtering by Class Name is safest if we have it map.
      // I'll assume we filter by matching name for now, or update dashboard.ts.
      // Actually dashboard.ts HAS class list.
      // I'll assume exact name match.
    }

    // 2. Sort/Filter based on Tab
    if (activeTab === "nilai") {
      // Already sorted by lowest score from server usually, but ensure it.
      res.sort((a, b) => a.score - b.score);
    } else {
      // Sort by lowest task submission
      res.sort((a, b) => a.taskSubmissionRate - b.taskSubmissionRate);
    }

    return res;
  }, [students, selectedClassId, activeTab, classList]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Card className="border border-slate-100 shadow-sm h-auto flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold text-neutral">
          Butuh Bimbingan
        </CardTitle>
        <div className="min-w-[90px]">
          <div className="bg-primary/5 rounded-md">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="h-7 text-xs px-2 border-0 bg-transparent text-[#317C74] font-semibold focus:ring-0">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {classList.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 border-b border-slate-100 pb-2 mb-4">
          <span
            onClick={() => setActiveTab("nilai")}
            className={`cursor-pointer pb-2 -mb-2.5 transition-colors ${
              activeTab === "nilai"
                ? "text-neutral font-bold border-b-2 border-[#317C74]"
                : "hover:text-slate-700"
            }`}
          >
            Nilai Rendah
          </span>
          <span
            onClick={() => setActiveTab("tugas")}
            className={`cursor-pointer pb-2 -mb-2.5 transition-colors ${
              activeTab === "tugas"
                ? "text-neutral font-bold border-b-2 border-[#317C74]"
                : "text-slate-300 hover:text-slate-500"
            }`}
          >
            Tugas Rendah
          </span>
        </div>

        {/* Clean Vertical List */}
        <div className="space-y-0 flex-1 min-h-[250px]">
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student, i) => {
              // Determine value to show based on tab
              const value =
                activeTab === "nilai"
                  ? student.score
                  : student.taskSubmissionRate;
              const max = activeTab === "nilai" ? student.maxScore : 100;

              return (
                <div
                  key={student.id || i}
                  className={`py-4 flex items-center justify-between group ${
                    i !== paginatedStudents.length - 1  
                      ? "border-b border-slate-50"
                      : ""
                  }`}
                >
                  {/* Left: Name + Class/Subject */}
                  <div className="flex flex-col flex-1 min-w-0 mr-4">
                    <p className="text-sm font-bold text-neutral truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium truncate">
                      {classList.find((c) => c.name === student.className)?.department}
                    </p>
                  </div>

                  {/* Right: Progress Bar & Score */}
                  <div className="flex items-center gap-3 w-[140px] justify-end">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <p className="text-xs font-bold text-neutral w-[40px] text-right">
                      {value}/{max}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
              <p>Tidak ada data.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-auto pt-4">
          <NumericPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
