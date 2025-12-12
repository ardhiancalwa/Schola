import { StudentStats } from "@/components/students/student-stats";
import { StudentToolbar } from "@/components/students/student-toolbar";
import { StudentTable } from "@/components/students/student-table";

export default function StudentsPage() {
  return (
    <div className="space-y-8 pb-8 font-sans">
      <h1 className="text-2xl font-bold text-neutral">Siswa</h1>

      <div className="space-y-8">
        <StudentStats />
        <StudentToolbar />
        <StudentTable />
      </div>
    </div>
  );
}
