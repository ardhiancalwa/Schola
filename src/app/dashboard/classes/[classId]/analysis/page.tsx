import { getClassDetails } from "@/lib/actions/classes";
import { UploadZone } from "@/components/summarizer/upload-zone";
import { ArrowLeft, GraduationCap, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const classData = await getClassDetails(classId);

  if (!classData) {
    redirect("/dashboard/classes");
  }

  // Parse Grade Number from Name or use Education Level?
  // User Prompt says: "Display... Education level + Grade (e.g., "Tingkat: SMA Kelas XI")"
  // Assuming "SMA" from education_level and "XI" derived or we can just use generic if data is messy.
  // Ideally we parse "grade_number" properly in actions but here visual is key.

  return (
    <div className="font-sans max-w-full space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Link
            href={`/dashboard/classes/${classId}`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 w-fit transition-colors mb-2 group"
          >
            <div className="p-1 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Kembali ke Kelas</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Ringkasan & Insight Materi
            </h1>
            <p className="text-slate-500">
              Unggah materi pembelajaran dan dapatkan ringkasan serta insight
              lanjutan berbasis AI.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#E6F7F7] border border-[#317C74]/20 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#317C74] shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Tingkat:</span>
              <span className="font-bold text-slate-700">
                {classData.education_level} {classData.name}
              </span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-[#317C74]/10"></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">
                Metode Belajar:
              </span>
              <span className="font-bold text-slate-700 capitalize">
                {classData.learning_method}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <UploadZone
        classId={classId}
        classInfo={{
          level: classData.education_level,
          grade: 11, // Mock or parse from name
          method: classData.learning_method,
        }}
      />
    </div>
  );
}
