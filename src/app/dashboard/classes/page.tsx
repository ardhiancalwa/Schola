"use client";

import Link from "next/link";
import {
  Calculator,
  Users,
  Book,
  FlaskConical,
  Languages,
  Palette,
  Globe,
  Dumbbell,
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
import { createClient } from "@/lib/supabase/client"; // Use Client Supabase
import { AddClassDialog } from "@/components/classes/add-class-dialog";
import Image from "next/image";
import classNotFound from "../../../../public/assets/images/class-not-found.png";
import { useEffect, useState } from "react";

// Helper to determine icon based on subject name (simple matching)
const getSubjectConfig = (subjectName: string) => {
  const lower = subjectName.toLowerCase();
  if (lower.includes("matematika"))
    return {
      icon: <Calculator className="w-6 h-6 text-[#317C74]" />,
      bg: "bg-teal-50",
    };
  if (
    lower.includes("fisika") ||
    lower.includes("kimia") ||
    lower.includes("biologi") ||
    lower.includes("ipa")
  )
    return {
      icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    };
  if (
    lower.includes("bahasa") ||
    lower.includes("inggris") ||
    lower.includes("indonesia")
  )
    return {
      icon: <Languages className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
    };
  if (lower.includes("seni") || lower.includes("musik"))
    return {
      icon: <Palette className="w-6 h-6 text-pink-600" />,
      bg: "bg-pink-50",
    };
  if (
    lower.includes("sejarah") ||
    lower.includes("geografi") ||
    lower.includes("ips")
  )
    return {
      icon: <Globe className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
    };
  if (lower.includes("olahraga"))
    return {
      icon: <Dumbbell className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50",
    };

  return {
    icon: <Book className="w-6 h-6 text-[#317C74]" />,
    bg: "bg-[#317C74]/10",
  };
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering State
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all-subjects");

  const supabase = createClient();

  useEffect(() => {
    const fetchClasses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Updated query to get related student count
        const { data } = await supabase
          .from("classes")
          .select("*, students(count)")
          .eq("teacher_id", user.id)
          .order("created_at", { ascending: false });

        if (data) {
          // Map to flat structure with studentCount
          const mappedClasses = data.map((item: any) => ({
            ...item,
            studentCount: item.students?.[0]?.count || 0,
          }));
          setClasses(mappedClasses);
        }
      }
      setLoading(false);
    };

    fetchClasses();
  }, [supabase]);

  // Derive unique options for filters
  const uniqueLevels = Array.from(
    new Set(classes.map((c) => c.education_level))
  ).filter(Boolean);
  const uniqueSubjects = Array.from(
    new Set(classes.map((c) => c.subject))
  ).filter(Boolean);

  // Apply Filters
  const filteredClasses = classes.filter((cls) => {
    const matchLevel =
      filterLevel === "all" || cls.education_level === filterLevel;
    const matchSubject =
      filterSubject === "all-subjects" || cls.subject === filterSubject;
    return matchLevel && matchSubject;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="font-sans max-w-full min-h-screen pb-20">
      {/* 1. Header */}
      <div className="self-start md:self-end">
        {/* 3. Class Grid */}
        {classes.length > 0 ? (
          <>
            {/* 2. Toolbar (Filters & Action) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              {/* Left: Filters - Dynamic now */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Level Filter */}
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-full border-slate-300">
                    <SelectValue placeholder="Semua Jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenjang</SelectItem>
                    {uniqueLevels.map((lvl: any) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Subject Filter */}
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-full sm:w-[220px] rounded-full border-slate-300">
                    <SelectValue placeholder="Semua Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-subjects">
                      Semua Mata Pelajaran
                    </SelectItem>
                    {uniqueSubjects.map((subj: any) => (
                      <SelectItem key={subj} value={subj}>
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <AddClassDialog />
            </div>

            {filteredClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => {
                  const style = getSubjectConfig(cls.subject);
                  return (
                    <div
                      key={cls.id}
                      className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-[#317C74]/30 relative flex flex-col"
                    >
                      {/* Top Row: Icon & Status */}
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center group-hover:opacity-80 transition-opacity`}
                        >
                          {style.icon}
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200 rounded-full px-3 py-1 text-xs font-medium capitalize"
                        >
                          {cls.learning_method || "Luring"}
                        </Badge>
                      </div>

                      {/* Title Content */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-neutral group-hover:text-[#317C74] transition-colors">
                          {cls.name}
                        </h3>
                        <p className="text-slate-500 text-sm">{cls.subject}</p>
                        <div className="text-xs text-slate-400 mt-1">
                          {cls.education_level} • {cls.department || "Umum"}
                        </div>
                      </div>

                      {/* Stats - Hardcoded for now as per plan */}
                      <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 mt-auto">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{cls.studentCount || 0} Siswa</span>
                      </div>

                      {/* Footer Action */}
                      <Link
                        href={`/dashboard/classes/${cls.id}`}
                        className="w-full"
                      >
                        <Button className="w-full bg-[#317C74] hover:bg-[#2A6B63] text-white rounded-lg h-11 font-semibold shadow-sm group-hover:shadow-md transition-all">
                          Lihat Detail Kelas
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500">
                Tidak ada kelas yang sesuai dengan filter.
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            {/* Simple Illustration Placeholder */}
            <Image
              src={classNotFound}
              alt="Empty State"
              width={400}
              height={400}
            />

            <h3 className="text-xl font-bold text-neutral mb-2">
              Anda Belum Memiliki Kelas Saat Ini.
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Buat kelas pertama untuk mulai memantau perkembangan siswa secara
              lebih terstruktur.
            </p>

            <AddClassDialog />
          </div>
        )}
      </div>
    </div>
  );
}
