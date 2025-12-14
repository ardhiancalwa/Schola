"use client";

import Link from "next/link";
import {
  Calculator,
  Users,
  Plus,
  Book,
  MoreVertical,
  FlaskConical,
  Languages,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// --- Dummy Data ---
// Icon mapping helper
const getIcon = (type: string) => {
  switch (type) {
    case "math":
      return <Calculator className="w-6 h-6 text-[#317C74]" />;
    case "science":
      return <FlaskConical className="w-6 h-6 text-[#317C74]" />;
    case "language":
      return <Languages className="w-6 h-6 text-[#317C74]" />;
    case "art":
      return <Palette className="w-6 h-6 text-[#317C74]" />;
    default:
      return <Book className="w-6 h-6 text-[#317C74]" />;
  }
};

const classesData = [
  {
    id: "1",
    name: "Kelas XI A",
    subject: "Matematika",
    students: 45,
    status: "Aktif",
    type: "math",
  },
  {
    id: "2",
    name: "Kelas XI B",
    subject: "Matematika",
    students: 42,
    status: "Aktif",
    type: "math",
  },
  {
    id: "3",
    name: "Kelas X A",
    subject: "Fisika",
    students: 38,
    status: "Aktif",
    type: "science",
  },
  {
    id: "4",
    name: "Kelas XII C",
    subject: "Bahasa Inggris",
    students: 40,
    status: "Aktif",
    type: "language",
  },
  {
    id: "5",
    name: "Kelas X B",
    subject: "Seni Budaya",
    students: 35,
    status: "Aktif",
    type: "art",
  },
  {
    id: "6",
    name: "Kelas XI C",
    subject: "Kimia",
    students: 41,
    status: "Aktif",
    type: "science",
  },
  {
    id: "7",
    name: "Kelas XII A",
    subject: "Biologi",
    students: 44,
    status: "Aktif",
    type: "science",
  },
  {
    id: "8",
    name: "Kelas X C",
    subject: "Sejarah",
    students: 39,
    status: "Aktif",
    type: "default",
  },
  {
    id: "9",
    name: "Kelas XI D",
    subject: "Matematika",
    students: 43,
    status: "Aktif",
    type: "math",
  },
];

export default function ClassesPage() {
  return (
    <div className="p-6 md:p-8 font-sans max-w-7xl mx-auto min-h-screen pb-20">
      {/* 1. Header */}
      <h1 className="text-2xl font-bold text-neutral mb-8">Kelas</h1>

      {/* 2. Toolbar (Filters & Action) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Left: Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px] rounded-full border-slate-300">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              <SelectItem value="x">Kelas X</SelectItem>
              <SelectItem value="xi">Kelas XI</SelectItem>
              <SelectItem value="xii">Kelas XII</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-subjects">
            <SelectTrigger className="w-full sm:w-[220px] rounded-full border-slate-300">
              <SelectValue placeholder="Semua Mata Pelajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-subjects">Semua Mata Pelajaran</SelectItem>
              <SelectItem value="math">Matematika</SelectItem>
              <SelectItem value="science">Sains</SelectItem>
              <SelectItem value="language">Bahasa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right: Action */}
        <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white rounded-lg px-6 h-10 shrink-0 font-medium shadow-md shadow-teal-700/10">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kelas
        </Button>
      </div>

      {/* 3. Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesData.map((cls) => (
          <div
            key={cls.id}
            className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-[#317C74]/30 relative flex flex-col"
          >
            {/* Top Row: Icon & Status */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#317C74]/10 rounded-xl flex items-center justify-center group-hover:bg-[#317C74]/20 transition-colors">
                {getIcon(cls.type)}
              </div>
              <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none rounded-full px-3 py-1 text-xs font-semibold">
                {cls.status}
              </Badge>
            </div>

            {/* Title Content */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-neutral group-hover:text-[#317C74] transition-colors">
                {cls.name}
              </h3>
              <p className="text-slate-500 text-sm">{cls.subject}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 mt-auto">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{cls.students} Siswa</span>
            </div>

            {/* Footer Action */}
            <Link href={`/dashboard/classes/${cls.id}`} className="w-full">
              <Button className="w-full bg-[#317C74] hover:bg-[#2A6B63] text-white rounded-lg h-11 font-semibold shadow-sm group-hover:shadow-md transition-all">
                Lihat Detail Kelas
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Empty state placeholder (hidden for now since we have dummy data) */}
      {classesData.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada kelas yang dibuat.</p>
        </div>
      )}
    </div>
  );
}
