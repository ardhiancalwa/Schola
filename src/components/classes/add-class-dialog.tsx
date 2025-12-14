"use client";

import {
  Plus,
  Loader2,
  UploadCloud,
  FileText,
  FileWarning,
  Check,
  X,
  ChevronLeft,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState, useEffect, useState } from "react";
import { createClassWithStudents } from "@/lib/actions/classes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  message: "",
};

export function AddClassDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form Data State for Step 1
  const [formData, setFormData] = useState({
    name: "",
    education_level: "SMA",
    department: "IPA",
    subject: "",
    learning_method: "Visual (Gambar, Video, Diagram)", // Default to a valid option
  });

  // Step 2 State
  const [fileStatus, setFileStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [fileName, setFileName] = useState("");
  const [studentsData, setStudentsData] = useState<any[]>([]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setFileStatus("idle");
        setFileName("");
        setStudentsData([]);
        setFormData({
          name: "",
          education_level: "SMA",
          department: "IPA",
          subject: "",
          learning_method: "Visual (Gambar, Video, Diagram)",
        });
      }, 300); // Small delay for animation
    }
  }, [open]);

  const handleNext = () => {
    // Basic validation for Step 1
    if (!formData.name || !formData.subject) {
      toast.error("Mohon lengkapi Nama Kelas dan Mata Pelajaran.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Sanitize studentsData to ensure plain objects (fix: "Only plain objects can be passed to Server Functions")
      // Sanitize studentsData to ensure plain objects (fix: "Only plain objects can be passed to Server Functions")
      const sanitizedStudents = studentsData.map((row: any) => ({
        name: String(
          row["Nama Lengkap"] || row["Nama"] || row["name"] || row["nama"] || ""
        ),
        nis: String(row["NIS"] || row["nis"] || ""),
        gender: String(
          row["Jenis Kelamin"] || row["gender"] || row["Gender"] || "L"
        ),
        tugas_1: Number(row["Tugas 1"] || row["tugas_1"] || 0),
        tugas_2: Number(row["Tugas 2"] || row["tugas_2"] || 0),
        uts: Number(row["UTS"] || row["uts"] || 0),
        uas: Number(row["UAS"] || row["uas"] || 0),
      }));

      const result = await createClassWithStudents({
        classData: formData,
        studentsData: sanitizedStudents,
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setFileStatus("error");
      toast.error("Ukuran file terlalu besar. Maksimal 10 MB.");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Validate Columns (Case insensitive check)
        if (data.length === 0) {
          setFileStatus("error");
          toast.error("File kosong.");
          return;
        }

        const firstRow = data[0] as object;
        const keys = Object.keys(firstRow).map((k) => k.toLowerCase());
        const hasNIS = keys.some((k) => k.includes("nis"));
        const hasNama = keys.some(
          (k) => k.includes("nama") || k.includes("name")
        );
        // Gender is optional but good to have

        if (!hasNIS || !hasNama) {
          setFileStatus("error");
          toast.error("Format salah. Pastikan ada kolom NIS dan Nama.");
          return;
        }

        setStudentsData(data);
        setFileStatus("success");
      } catch (err) {
        console.error(err);
        setFileStatus("error");
        toast.error("Gagal membaca file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Custom Dropzone Handlers
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileStatus("error");
        toast.error("Ukuran file terlalu besar. Maksimal 10 MB.");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          setStudentsData(data);
          setFileStatus("success");
        } catch (err) {
          setFileStatus("error");
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white rounded-lg px-6 h-10 shrink-0 font-medium shadow-md shadow-teal-700/10">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kelas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-2xl border-0">
        <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-start">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral">
              {step === 1 ? "Tambah Kelas Baru" : "Tambah Data Siswa"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {step === 1
                ? "Lengkapi informasi berikut untuk membuat kelas baru yang akan Anda kelola."
                : "Tambahkan data siswa dengan mengunggah file CSV atau Excel (.xlsx / .xls)."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              {/* Nama Kelas */}
              <div className="space-y-2 text-start">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-neutral"
                >
                  Nama Kelas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Kelas XI A"
                  className="h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74]"
                  required
                />
              </div>

              {/* Jenjang & Jurusan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-start">
                  <Label className="text-sm font-semibold text-neutral">
                    Jenjang <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.education_level}
                    onValueChange={(val) =>
                      setFormData({ ...formData, education_level: val })
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-200 w-full">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SD">SD</SelectItem>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="SMA">SMA</SelectItem>
                      <SelectItem value="SMK">SMK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-start">
                  <Label className="text-sm font-semibold text-neutral">
                    Jurusan
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) =>
                      setFormData({ ...formData, department: val })
                    }
                  >
                    <SelectTrigger className="h-11 border-slate-200 w-full">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IPA">IPA</SelectItem>
                      <SelectItem value="IPS">IPS</SelectItem>
                      <SelectItem value="Multimedia">Multimedia</SelectItem>
                      <SelectItem value="Animasi">Animasi</SelectItem>
                      <SelectItem value="TKJ">TKJ</SelectItem>
                      <SelectItem value="RPL">RPL</SelectItem>
                      <SelectItem value="TJAT">TJAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mata Pelajaran */}
              <div className="space-y-2 text-start">
                <Label
                  htmlFor="subject"
                  className="text-sm font-semibold text-neutral"
                >
                  Mata Pelajaran <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Contoh: Matematika Wajib"
                  className="h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74]"
                  required
                />
              </div>

              {/* Metode Belajar */}
              <div className="space-y-2 text-start">
                <Label className="text-sm font-semibold text-neutral">
                  Metode Belajar <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.learning_method}
                  onValueChange={(val) =>
                    setFormData({ ...formData, learning_method: val })
                  }
                >
                  <SelectTrigger className="h-11 border-slate-200 w-full">
                    <SelectValue placeholder="Pilih Metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visual (Gambar, Video, Diagram)">
                      Visual (Gambar, Video, Diagram)
                    </SelectItem>
                    <SelectItem value="Auditori (Mendengar & Diskusi)">
                      Auditori (Mendengar & Diskusi)
                    </SelectItem>
                    <SelectItem value="Membaca / Menulis">
                      Membaca / Menulis
                    </SelectItem>
                    <SelectItem value="Logis / Analitis">
                      Logis / Analitis
                    </SelectItem>
                    <SelectItem value="Sosial (Belajar Kelompok)">
                      Sosial (Belajar Kelompok)
                    </SelectItem>
                    <SelectItem value="Kreatif (Seni & Storytelling)">
                      Kreatif (Seni & Storytelling)
                    </SelectItem>
                    <SelectItem value="Berbasis Teknologi">
                      Berbasis Teknologi
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-bold text-neutral">
                  Unggah Data
                </Label>

                {/* DROPZONE */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`
                            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative
                            ${
                              fileStatus === "error"
                                ? "border-red-500 bg-red-50"
                                : fileStatus === "success"
                                ? "border-green-500 bg-green-50"
                                : isDragOver
                                ? "border-[#317C74] bg-teal-50"
                                : "border-slate-300 hover:bg-slate-50"
                            }
                        `}
                >
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {fileStatus === "idle" && (
                    <>
                      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3 text-[#317C74]">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="font-bold text-[#317C74]">
                          Klik di sini
                        </span>{" "}
                        untuk mengunggah file atau seret file ke sini.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Format yang didukung: .CSV, .XLS, .XLSX (maks. 10 MB)
                      </p>
                    </>
                  )}

                  {fileStatus === "success" && (
                    <>
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3 text-green-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-green-700 mb-1">
                        {fileName}
                      </p>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                        <Check className="w-4 h-4" />
                        <span>File Berhasil Diunggah</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Silakan lanjutkan dengan menekan tombol Tambah Kelas.
                      </p>
                    </>
                  )}

                  {fileStatus === "error" && (
                    <>
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3 text-red-600">
                        <FileWarning className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-red-600 font-semibold mb-1">
                        <X className="w-4 h-4" />
                        <span>Format Salah / Gagal</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        File tidak dapat diproses. Periksa kembali isi file
                        Anda.
                      </p>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <a
                    href="/Template_Siswa_Schola.xlsx" // Path ke folder public (root)
                    download="Template_Siswa_Schola.xlsx" // Nama file saat didownload user
                    className="text-[#317C74] text-sm h-auto p-0 hover:no-underline hover:text-[#2A6B63] font-medium cursor-pointer"
                  >
                    Unduh Template Data Siswa
                  </a>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 flex justify-between! items-center w-full">
            {step === 2 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="h-11 rounded-lg border-slate-200 text-slate-600 hover:text-slate-800"
                disabled={isSubmitting}
              >
                Sebelumnya
              </Button>
            ) : (
              <div /> /* Spacer */
            )}

            <div className="flex gap-2">
              {step === 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-lg border-slate-200 text-slate-600 hover:text-slate-800"
                >
                  Batal
                </Button>
              )}

              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-11 rounded-lg bg-[#317C74] hover:bg-[#2A6B63] text-white min-w-[120px]"
                >
                  Selanjutnya
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="h-11 rounded-lg bg-[#317C74] hover:bg-[#2A6B63] text-white min-w-[120px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Tambah Kelas"
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
