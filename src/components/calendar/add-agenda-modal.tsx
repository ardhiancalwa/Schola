"use client";

import * as React from "react";
import { X, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEvent } from "@/lib/actions/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddAgendaModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAgendaModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState("green");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Use generic ref for form
  const formRef = React.useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.append("color", selectedColor);

    if (date) {
      // Append formatted date YYYY-MM-DD
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      formData.set("date", `${yyyy}-${mm}-${dd}`);
    } else {
      toast.error("Tanggal wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const res = await createEvent(formData);
      if (res.success) {
        toast.success("Agenda berhasil ditambahkan");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error("Gagal menambahkan agenda");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  }

  const colors = [
    { id: "green", bg: "bg-emerald-100", activeRing: "ring-emerald-400" },
    { id: "yellow", bg: "bg-amber-100", activeRing: "ring-amber-400" },
    { id: "purple", bg: "bg-purple-100", activeRing: "ring-purple-400" },
    { id: "blue", bg: "bg-blue-100", activeRing: "ring-blue-400" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-xl font-bold text-slate-800">Tambah Agenda</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Nama Acara
            </label>
            <Input name="title" required className="h-10 text-base" />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-sm font-semibold text-slate-700">
              Tanggal
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "h-10 w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: localeId })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {/* Hidden input to ensure FormData picks it up if needed, though we set it manually in handleSubmit */}
            <input
              type="hidden"
              name="date_fallback"
              value={date ? date.toISOString() : ""}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Waktu
            </label>
            <div className="flex items-center gap-2">
              <Input
                name="startTime"
                type="time"
                required
                className="h-10 text-base"
              />
              <span className="text-slate-400 font-bold">-</span>
              <Input
                name="endTime"
                type="time"
                required
                className="h-10 text-base"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c.id)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all border border-transparent",
                    c.bg,
                    selectedColor === c.id &&
                      `ring-2 ring-offset-2 ${c.activeRing}`
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-[#317C74] hover:bg-[#2A6B63] text-white min-w-[100px]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
