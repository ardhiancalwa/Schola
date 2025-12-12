"use client";

import { AttendanceTable } from "@/components/attendance/attendance-table";

export default function AttendancePage() {
  return (
    <div className="space-y-6 font-sans pb-10">
      <h2 className="text-2xl font-bold text-neutral">Kehadiran</h2>
      <AttendanceTable />
    </div>
  );
}
