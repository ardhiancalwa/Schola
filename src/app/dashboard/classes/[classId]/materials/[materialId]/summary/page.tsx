import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Zap,
  Clock,
  FileText,
  CheckCircle2,
  BookOpen,
  Brain,
  AlertTriangle,
  Eye,
  RefreshCw,
  Download,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnalysis } from "@/lib/actions/summarizer";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default async function MaterialSummaryPage({
  params,
}: {
  params: Promise<{ classId: string; materialId: string }>;
}) {
  const { classId, materialId } = await params;

  // Fetch Real Analysis Data
  const analysis = await getAnalysis(materialId);

  if (!analysis) {
    // Handling not found - maybe redirect to upload or show error
    redirect(`/dashboard/classes/${classId}/analysis`);
  }

  const {
    summary,
    class_level,
    grade_number,
    learning_method,
    created_at,
    file_name,
  } = analysis;
  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: idLocale,
  });

  return (
    <div className="font-sans max-w-full space-y-8 pb-32">
      {/* 1. Header & Meta */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Link
            href={`/dashboard/classes/${classId}/analysis`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 w-fit transition-colors mb-2 group"
          >
            <div className="p-1 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Unggah Materi Lain</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Ringkasan & Insight Materi
            </h1>
            <p className="text-slate-500">
              Analisis AI telah selesai. Berikut adalah ringkasan dan
              rekomendasi pengajaran.
            </p>
          </div>
        </div>

        {/* Meta Banner */}
        <div className="bg-[#F0FDFA]/30 border border-[#317C74]/20 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#317C74]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Tingkat:</span>
              <span className="font-bold text-slate-700">
                {class_level} Kelas {grade_number}
              </span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-amber-500">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">
                Metode Belajar:
              </span>
              <span className="font-bold text-slate-700 capitalize">
                {learning_method}
              </span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-purple-500">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Dianalisa:</span>
              <span className="font-bold text-slate-700 capitalize">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. File Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden p-10 flex flex-col items-center text-center">
        {/* Top Green Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#317C74]"></div>

        <div className="w-16 h-16 bg-[#317C74]/5 rounded-2xl flex items-center justify-center mb-6 text-[#317C74]">
          <FileText className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">{file_name}</h3>

        <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-full">
          <CheckCircle2 className="w-5 h-5 fill-green-600 text-white" />
          File Berhasil Dianalisa
        </div>
      </div>

      {/* 3. Summary Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-8 shadow-sm">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[#317C74]" />
          <h2 className="text-xl font-bold text-gray-900">Ringkasan Materi</h2>
        </div>

        {/* Intro Box */}
        <div className="bg-[#F0FDFA] rounded-lg p-6 text-slate-700 leading-relaxed text-sm border border-[#317C74]/10">
          <p>{summary.material.description}</p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {summary.material.sections.map((card: any, idx: number) => (
            <div
              key={idx}
              className={`rounded-xl p-6 ${
                card.backgroundColor === "yellow"
                  ? "bg-[#FFFBEB]" // Amber-50
                  : "bg-[#EFF6FF]" // Blue-50
              }`}
            >
              <h4
                className={`font-bold mb-4 text-sm ${
                  card.backgroundColor === "yellow"
                    ? "text-amber-950"
                    : "text-blue-950"
                }`}
              >
                {card.title}
              </h4>
              <ul className="space-y-3">
                {card.points.map((point: string, k: number) => (
                  <li
                    key={k}
                    className="flex gap-3 text-sm text-slate-700 items-start"
                  >
                    <div
                      className={`mt-0.5 shrink-0 ${
                        card.backgroundColor === "yellow"
                          ? "text-orange-500"
                          : "text-blue-500"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Insight Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Insight Pembelajaran
          </h2>
        </div>

        {/* Topics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
            Topik Utama
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.insights.mainTopics.map((topic: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Pain Points */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Bagian yang Berpotensi Sulit Dipahami
          </h4>
          <div className="space-y-3">
            {summary.insights.difficultAreas.map((diff: any, i: number) => (
              <div
                key={i}
                className="bg-[#FEF2F2] border-l-4 border-red-400 p-4 rounded-r-lg"
              >
                <h5 className="font-bold text-gray-900 text-sm mb-1">
                  {diff.title}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {diff.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="space-y-4 pt-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Eye className="w-4 h-4 text-blue-500" />
            Rekomendasi Metode Mengajar
          </h4>

          {summary.insights.teachingRecommendations.map(
            (rec: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#F0FDFA] rounded-xl p-6 border border-teal-50"
              >
                <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <Eye className="w-3 h-3" />
                  {rec.learningStyle}
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* Methods */}
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs mb-2">
                      Metode:
                    </h5>
                    <ul className="space-y-2">
                      {rec.methods.map((pt: string, i: number) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-slate-700 items-start"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Suggestions */}
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs mb-2">
                      Saran Praktis:
                    </h5>
                    <ul className="space-y-2">
                      {rec.suggestions.map((pt: string, i: number) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-slate-700 items-start"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#317C74] mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 z-50">
        <Link href={`/dashboard/classes/${classId}/analysis`}>
          <Button
            variant="outline"
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium px-6 h-12 rounded-xl shadow-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Analisa Ulang
          </Button>
        </Link>
        <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white font-bold px-6 h-12 rounded-xl shadow-lg shadow-teal-900/20">
          <Download className="w-4 h-4 mr-2" />
          Unduh Ringkasan
        </Button>
      </div>
    </div>
  );
}
