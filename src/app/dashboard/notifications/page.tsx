"use client";

import { useState } from "react";
import {
  Calendar,
  User,
  UserX,
  AlertCircle,
  Trash2,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Types & Data ---

type NotificationType = "schedule" | "performance" | "alert" | "warning";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isNew: boolean;
  date?: string; // For old notifications
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "schedule",
    title: "Anda Mengajar Matematika - XI A Pukul 08:00",
    message: "Jangan lupa siapkan materi pembelajaran.",
    isNew: true,
  },
  {
    id: "2",
    type: "performance",
    title: "Peningkatan Performa Siswa",
    message: "Chintia Putri mengalami peningkatan nilai signifikan minggu ini.",
    isNew: true,
  },
  {
    id: "3",
    type: "alert",
    title: "Kehadiran di Bawah 75%",
    message: "Nadia Putri menunjukkan penurunan kehadiran minggu ini.",
    isNew: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Siswa Membutuhkan Perhatian",
    message: "Performa akademik Rafa Ahmad berada di bawah standar kelas.",
    isNew: false,
    date: "24/10/2025",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [activeTab, setActiveTab] = useState("Semua");

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
  };

  // Helper to get styles based on type
  const getStyles = (type: NotificationType) => {
    switch (type) {
      case "schedule":
      case "performance":
        return {
          bg: "bg-[#F0FDF9]", // Mint/Teal tint
          iconBg: "bg-transparent",
          iconColor: "text-[#317C74]", // Primary
          icon: type === "schedule" ? Calendar : User,
          badgeColor: "bg-[#317C74]",
        };
      case "alert":
        return {
          bg: "bg-[#FEF2F2]", // Red tint
          iconBg: "bg-transparent",
          iconColor: "text-red-500",
          icon: UserX,
          badgeColor: "bg-red-400", // Usually lighter for alert badge if used
        };
      case "warning":
        return {
          bg: "bg-[#FFFBEB]", // Yellow/Amber tint
          iconBg: "bg-transparent",
          iconColor: "text-amber-500",
          icon: AlertCircle,
          badgeColor: "bg-amber-400",
        };
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "Baru") return n.isNew;
    if (activeTab === "Belum Dibaca") return n.isNew; // Assuming 'New' is 'Unread' for this demo
    return true;
  });

  return (
    <div className="space-y-6 pb-10 font-sans max-w-5xl">
      <h2 className="text-2xl font-bold text-neutral">Notifikasi</h2>

      {/* --- Hero Banner --- */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-neutral">
              Semua Info Terbaru untuk Mendukung Aktivitas Mengajar Anda
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Pantau seluruh pembaruan terbaru mengenai siswa, kelas, dan
              aktivitas belajar Anda.
            </p>
          </div>
          <Button
            onClick={handleMarkAllRead}
            className="bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46] border-0 shadow-none font-semibold"
          >
            Tandai Semua Dibaca
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-100">
          {["Semua", "Baru", "Belum Dibaca"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-sm font-medium transition-all relative",
                activeTab === tab
                  ? "text-[#317C74] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#317C74]"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Notification List --- */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const style = getStyles(notification.type);
            const Icon = style.icon;

            return (
              <div
                key={notification.id}
                className={cn(
                  "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl transition-all",
                  style.bg
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-full shrink-0",
                    style.iconBg
                  )}
                >
                  <Icon
                    className={cn("h-6 w-6", style.iconColor)}
                    strokeWidth={2}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-neutral mb-0.5">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {notification.message}
                  </p>
                </div>

                {/* Actions / Status */}
                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                  {notification.isNew ? (
                    <span
                      className={cn(
                        "text-xs px-3 py-1 rounded-md text-white font-medium shrink-0",
                        notification.type === "alert"
                          ? "bg-red-400"
                          : "bg-[#5BBFBA]" // Custom Teal for "Baru" or Red for Alert
                      )}
                    >
                      Baru
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 shrink-0">
                      {notification.date}
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 px-2 h-8 gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium">Belum ada notifikasi</p>
          </div>
        )}
      </div>
    </div>
  );
}
