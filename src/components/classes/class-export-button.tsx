"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export function ClassExportButton({
  data,
  classId,
}: {
  data: any[];
  classId: string;
}) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      data.map((s) => ({
        ID: s.id,
        NIS: s.nis || "-",
        Nama: s.name,
        Gender: s.gender,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");
    XLSX.writeFile(wb, `Data_Siswa_Kelas_${classId}.xlsx`);
    toast.success("Data berhasil diunduh");
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className="border-slate-200 text-slate-600 hover:text-[#317C74] gap-2 font-semibold rounded-full"
    >
      Ekspor Data <Upload className="w-4 h-4" />
    </Button>
  );
}
