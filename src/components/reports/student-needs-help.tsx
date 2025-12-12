import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const students = [
  { name: "Reno Renaldi", score: 65, tasks: "28/30" },
  { name: "Reno Renaldi", score: 65, tasks: "28/30" }, // Duplicate for dummy data as requested
  { name: "Reno Renaldi", score: 65, tasks: "28/30" },
];

export function StudentNeedsHelp() {
  return (
    <Card className="shadow-sm border-none rounded-xl h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold text-neutral">
          Siswa yang Membutuhkan Bimbingan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student, i) => (
          <div key={i} className="bg-[#F0FDF9] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-sm text-neutral">{student.name}</p>
              <span className="text-xs font-medium text-neutral">
                Perlu Bimbingan
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-600">
                <span className="font-medium">Nilai Akhir:</span>{" "}
                <span className="text-neutral font-bold text-sm">
                  {student.score}
                </span>
              </p>
              <p className="text-xs text-slate-600">
                Pengumpulan Tugas{" "}
                <span className="text-neutral font-semibold">
                  {student.tasks}
                </span>
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
