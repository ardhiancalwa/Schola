"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  LogOut,
  Sparkles,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import logo from "../../../public/assets/images/logo-dashboard.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Kelas Saya", href: "/dashboard/classes", icon: GraduationCap },
  { name: "Siswa", href: "/dashboard/students", icon: Users },
  { name: "Kehadiran", href: "/dashboard/attendance", icon: ClipboardCheck },
  { name: "Kalendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Laporan Belajar", href: "/dashboard/reports", icon: FileText },
];

const utilities = [
  { name: "Notifikasi", href: "/dashboard/notifications", icon: Bell },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-[280px] flex-col justify-between border-r border-slate-100 bg-white p-6 font-sans">
      {/* Top Section */}
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2">
          <Image src={logo} alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Utilities */}
      <div className="space-y-6">
        <nav className="flex flex-col gap-1 border-t border-slate-100 pt-6">
          <p className="px-4 text-xs font-semibold uppercase text-slate-400 mb-2">
            Lainnya
          </p>
          {utilities.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700"
              >
                <Icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600" />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={() => logout()}
            className="group flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-danger transition-all duration-200 hover:bg-red-50 hover:text-danger"
          >
            <LogOut className="h-5 w-5 text-danger/70 transition-colors group-hover:text-danger" />
            Keluar
          </button>
        </nav>

        {/* User Profile Mini (Optional visual filler based on common designs) */}
        {/* <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
             <div className="h-10 w-10 rounded-full bg-slate-200" />
             <div className="text-xs">
                 <p className="font-semibold text-slate-700">Sara Wijaya</p>
                 <p className="text-slate-400">Guru Matematika</p>
             </div>
        </div> */}
      </div>
    </div>
  );
}
