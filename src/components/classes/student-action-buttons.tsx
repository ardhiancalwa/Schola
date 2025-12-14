"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteStudent,
  updateStudent,
  updateStudentGrades,
} from "@/lib/actions/students";
import { toast } from "sonner";

export function StudentActionButtons({
  student,
  classId,
}: {
  student: any;
  classId: string;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: student.name,
    nis: student.nis || "",
    gender: student.gender || "L",
    // Grades
    tugas_1: student.tugas_1 === "-" ? 0 : Number(student.tugas_1) || 0,
    uts: student.uts === "-" ? 0 : Number(student.uts) || 0,
    tugas_2: student.tugas_2 === "-" ? 0 : Number(student.tugas_2) || 0,
    uas: student.uas === "-" ? 0 : Number(student.uas) || 0,
  });
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      // 1. Update Basic Info
      const resInfo = await updateStudent({
        studentId: student.id,
        name: formData.name,
        nis: formData.nis,
        gender: formData.gender,
        classId,
      });

      // 2. Update Grades
      const resGrades = await updateStudentGrades({
        studentId: student.id,
        tugas_1: formData.tugas_1,
        uts: formData.uts,
        tugas_2: formData.tugas_2,
        uas: formData.uas,
        classId,
      });

      if (resInfo.success && resGrades.success) {
        toast.success("Data dan nilai siswa berhasil diperbarui.");
        setIsEditOpen(false);
      } else {
        // Show error from whichever failed
        toast.error(resInfo.success ? resGrades.message : resInfo.message);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteStudent(student.id, classId);
      if (res.success) {
        toast.success(res.message);
        setIsDeleteOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsEditOpen(true)}
        className="h-8 w-8 text-slate-400 hover:text-blue-500"
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsDeleteOpen(true)}
        className="h-8 w-8 text-slate-400 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl ">
          <DialogHeader>
            <DialogTitle>Edit Data & Nilai Siswa</DialogTitle>
            <DialogDescription>
              Perbarui informasi dasar dan nilai akademik siswa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            {/* Section: Data Siswa */}
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <h4 className="text-sm font-semibold text-neutral">Data Diri</h4>
              <div className="grid gap-2">
                <Label>Nama Lengkap</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>NIS</Label>
                  <Input
                    value={formData.nis}
                    onChange={(e) =>
                      setFormData({ ...formData, nis: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Jenis Kelamin</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) =>
                      setFormData({ ...formData, gender: val })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section: Nilai - Grouped */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral">
                Masukan Nilai
              </h4>

              {/* Semester Ganjil / Group 1 */}
              <div className="p-3 bg-slate-50 rounded-lg space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tengah Semester
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs">Tugas 1 (0-100)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.tugas_1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tugas_1: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">UTS (0-100)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.uts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          uts: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Semester Genap / Group 2 */}
              <div className="p-3 bg-slate-50 rounded-lg space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Akhir Semester
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs">Tugas 2 (0-100)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.tugas_2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tugas_2: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">UAS (0-100)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.uas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          uas: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isPending}
              className="bg-[#317C74] text-white"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <TriangleAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral">Hapus Siswa?</h3>
              <p className="text-slate-500 text-sm">
                Yakin ingin menghapus <strong>{student.name}</strong>?
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="w-full"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Ya, Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
