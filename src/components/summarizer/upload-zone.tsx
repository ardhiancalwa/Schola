"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClassLevel, LearningMethod } from "@/types/summarizer";
import { analyzeMaterialAction } from "@/lib/actions/summarizer";

interface UploadZoneProps {
  classId: string;
  classInfo: {
    level: string; // e.g. SMA
    grade: number; // e.g. 11 (XI)
    method: string; // e.g. Visual
  };
}

export function UploadZone({ classId, classInfo }: UploadZoneProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    // Validate Max Size 20MB
    if (uploadedFile.size > 20 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 20MB.");
      return;
    }

    // Validate Type
    const validTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (
      !validTypes.includes(uploadedFile.type) &&
      !uploadedFile.name.endsWith(".pdf")
    ) {
      // Fallback check extension
      toast.error("Format file tidak didukung. Harap unggah PDF atau PPT.");
      return;
    }

    setFile(uploadedFile);
    toast.success("File siap diunggah!");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("classId", classId);
      formData.append("classLevel", (classInfo.level as ClassLevel) || "SMA"); // Fallback
      formData.append("gradeNumber", String(classInfo.grade || 10));
      // Use safe normalization helper or simple string pass - the server action handles the strict normalization now.
      // But we'll do a best-effort clean here.
      const method = classInfo.method || "visual";
      formData.append("learningMethod", method);

      const result = await analyzeMaterialAction(formData);

      if (result.success) {
        toast.success("Analisis selesai!");
        // Redirect to Result Page
        router.push(
          `/dashboard/classes/${classId}/materials/${result.materialId}/summary`
        );
      } else {
        toast.error(`Gagal menganalisis: ${result.error}`);
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-12 text-center h-[500px] flex flex-col items-center justify-center relative">
      {isAnalyzing ? (
        // Loading State
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#317C74] rounded-full border-t-transparent animate-spin"></div>
            <FileText className="absolute inset-0 m-auto text-[#317C74] w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sedang Menganalisis File...
            </h3>
            <p className="text-slate-500">
              AI kami sedang membaca dan merangkum materi Anda.
            </p>
          </div>
        </div>
      ) : !file ? (
        // Empty State
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-2xl mx-auto h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-slate-50/50 hover:bg-slate-50 group
            ${
              isDragging
                ? "border-[#317C74] bg-[#317C74]/5"
                : "border-slate-300"
            }
          `}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <div
            className={`p-4 rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 ${
              isDragging ? "text-[#317C74]" : "text-slate-400"
            }`}
          >
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-700">
              Klik di sini untuk mengunggah file atau seret file ke sini.
            </p>
            <p className="text-sm text-slate-500">
              Format yang didukung: PDF dan PPT (Maks. 20 MB)
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        // File Selected State
        <div className="w-full max-w-lg mx-auto bg-[#F0FDFA] border border-[#317C74]/20 rounded-xl p-8 space-y-6">
          <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-[#317C74] shadow-sm">
            <FileText className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 break-all line-clamp-2">
              {file.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-slate-200 hover:bg-white hover:text-red-600 hover:border-red-200"
              onClick={() => setFile(null)}
            >
              Ganti File
            </Button>
            <Button
              className="flex-1 bg-[#317C74] hover:bg-[#2A6B63] text-white"
              onClick={handleAnalyze}
            >
              Mulai Analisis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
