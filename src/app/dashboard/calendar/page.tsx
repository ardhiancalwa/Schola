"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddAgendaModal } from "@/components/calendar/add-agenda-modal";
import { getEvents, CalendarEvent } from "@/lib/actions/calendar";

type ViewMode = "month" | "week" | "day";

const DAYS_HEADER = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const HOURS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Month Grid for Dec 2025 (Fixed as per demo requirements)
const MONTH_GRID = [
  { day: 30, month: "prev", dateStr: "2025-11-30" },
  { day: 1, month: "curr", dateStr: "2025-12-01" },
  { day: 2, month: "curr", dateStr: "2025-12-02" },
  { day: 3, month: "curr", dateStr: "2025-12-03" },
  { day: 4, month: "curr", dateStr: "2025-12-04" },
  { day: 5, month: "curr", dateStr: "2025-12-05" },
  { day: 6, month: "curr", dateStr: "2025-12-06" },
  { day: 7, month: "curr", dateStr: "2025-12-07" },
  { day: 8, month: "curr", dateStr: "2025-12-08" },
  { day: 9, month: "curr", dateStr: "2025-12-09" },
  { day: 10, month: "curr", dateStr: "2025-12-10" },
  { day: 11, month: "curr", dateStr: "2025-12-11" },
  { day: 12, month: "curr", dateStr: "2025-12-12" },
  { day: 13, month: "curr", dateStr: "2025-12-13" },
  { day: 14, month: "curr", dateStr: "2025-12-14" },
  { day: 15, month: "curr", dateStr: "2025-12-15" },
  { day: 16, month: "curr", dateStr: "2025-12-16" },
  { day: 17, month: "curr", dateStr: "2025-12-17" },
  { day: 18, month: "curr", dateStr: "2025-12-18" },
  { day: 19, month: "curr", dateStr: "2025-12-19" },
  { day: 20, month: "curr", dateStr: "2025-12-20" },
  { day: 21, month: "curr", dateStr: "2025-12-21" },
  { day: 22, month: "curr", dateStr: "2025-12-22" },
  { day: 23, month: "curr", dateStr: "2025-12-23" },
  { day: 24, month: "curr", dateStr: "2025-12-24" },
  { day: 25, month: "curr", dateStr: "2025-12-25" },
  { day: 26, month: "curr", dateStr: "2025-12-26" },
  { day: 27, month: "curr", dateStr: "2025-12-27" },
  { day: 28, month: "curr", dateStr: "2025-12-28" },
  { day: 29, month: "curr", dateStr: "2025-12-29" },
  { day: 30, month: "curr", dateStr: "2025-12-30" },
  { day: 31, month: "curr", dateStr: "2025-12-31" },
  { day: 1, month: "next", dateStr: "2026-01-01" },
  { day: 2, month: "next", dateStr: "2026-01-02" },
  { day: 3, month: "next", dateStr: "2026-01-03" },
];

const WEEK_DATES = [
  { day: "Minggu", date: 30, dateStr: "2025-11-30" },
  { day: "Senin", date: 1, dateStr: "2025-12-01" },
  { day: "Selasa", date: 2, dateStr: "2025-12-02" },
  { day: "Rabu", date: 3, dateStr: "2025-12-03" },
  { day: "Kamis", date: 4, dateStr: "2025-12-04" },
  { day: "Jumat", date: 5, dateStr: "2025-12-05" },
  { day: "Sabtu", date: 6, dateStr: "2025-12-06" },
];

const getEventColor = (theme: string, view: ViewMode) => {
  const base =
    "font-semibold overflow-hidden transition-all cursor-pointer hover:shadow-md";
  // For Month View: border-l-4 and small
  // For Week/Day: full block
  const isGrid = view !== "month";
  const layout = isGrid
    ? "h-full w-full p-2 border-l-4"
    : "rounded-md border-l-4 shadow-sm text-xs py-1.5 px-2";

  let colors = "";
  switch (theme) {
    case "green":
      colors = "bg-[#F0FDF9] border-teal-400 text-teal-800";
      break;
    case "yellow":
      colors = "bg-[#FFF9E6] border-yellow-400 text-yellow-800";
      break;
    case "purple":
      colors = "bg-[#F3E8FF] border-purple-400 text-purple-800";
      break;
    case "blue":
      colors = "bg-[#EFF6FF] border-blue-400 text-blue-800";
      break;
    default:
      colors = "bg-slate-100 border-slate-300 text-slate-700";
      break;
  }
  return cn(base, layout, colors);
};

// --- Components ---
const MonthView = ({ events }: { events: CalendarEvent[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
        {DAYS_HEADER.map((day) => (
          <div
            key={day}
            className="py-4 text-center font-semibold text-slate-500 text-sm uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {MONTH_GRID.map((cell, index) => {
          const daysEvents = events.filter(
            (e) => e.start_date === cell.dateStr
          );
          return (
            <div
              key={index}
              className={cn(
                "min-h-[140px] border-b border-r border-slate-100 p-3 flex flex-col gap-2 transition-colors hover:bg-slate-50/50",
                (index + 1) % 7 === 0 && "border-r-0",
                cell.month !== "curr" && "bg-slate-50/30 text-slate-400"
              )}
            >
              <div className="flex items-start justify-start">
                <span
                  className={cn(
                    "text-sm font-semibold h-8 w-8 flex items-center justify-center rounded-full",
                    cell.dateStr === new Date().toISOString().split("T")[0]
                      ? "bg-[#317C74] text-white shadow-md"
                      : cell.month === "curr"
                      ? "text-neutral"
                      : "text-slate-400"
                  )}
                >
                  {cell.day}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mt-1">
                {daysEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={getEventColor(evt.color_theme, "month")}
                  >
                    <p className="truncate">{evt.title}</p>
                    <p className="text-[10px] opacity-80 truncate">
                      {evt.start_time} - {evt.end_time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WeekView = ({ events }: { events: CalendarEvent[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/50">
        <div className="py-4 text-center font-semibold text-slate-400 text-xs">
          WIB
        </div>
        {WEEK_DATES.map((wd) => (
          <div
            key={wd.day}
            className="py-4 text-center flex flex-col items-center"
          >
            <span className="text-xs text-slate-500 uppercase font-semibold">
              {wd.day}
            </span>
            <span
              className={cn(
                "text-lg font-bold h-8 w-8 flex items-center justify-center rounded-full mt-1",
                wd.date === 2
                  ? "bg-[#317C74] text-white shadow-sm"
                  : "text-neutral"
              )}
            >
              {wd.date}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="relative">
        {HOURS.map((hour) => {
          const hourInt = parseInt(hour.split(":")[0]); // 7, 8...
          return (
            <div
              key={hour}
              className="grid grid-cols-8 min-h-[80px] border-b border-slate-100 border-dashed"
            >
              {/* Time Sidebar */}
              <div className="text-xs text-slate-400 font-medium p-2 text-center -mt-2.5 bg-white z-10">
                {hour}
              </div>

              {/* 7 Days Columns */}
              {WEEK_DATES.map((wd, colIdx) => {
                // Match events for this date (wd.dateStr) AND start time starts with hour (Mock logic: matches Hour part)
                const slotEvents = events.filter((e) => {
                  return (
                    e.start_date === wd.dateStr &&
                    parseInt(e.start_time.split(":")[0]) === hourInt
                  );
                });

                return (
                  <div
                    key={colIdx}
                    className="border-l border-slate-100 p-1 relative hover:bg-slate-50/30 transition-colors"
                  >
                    {slotEvents.map((evt) => {
                      // Calculate height based on duration if needed, or fixed
                      const startH = parseInt(evt.start_time.split(":")[0]);
                      const endH = parseInt(evt.end_time.split(":")[0]);
                      const duration = Math.max(1, endH - startH);

                      return (
                        <div
                          key={evt.id}
                          className={cn(
                            getEventColor(evt.color_theme, "week"),
                            "absolute inset-x-1 top-1 z-10"
                          )}
                          style={{ height: `${duration * 80 - 8}px` }}
                        >
                          <p className="font-bold text-xs leading-tight mb-1">
                            {evt.title}
                          </p>
                          <p className="text-[10px] opacity-80">
                            {evt.start_time} - {evt.end_time}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DayView = ({
  events,
  onAdd,
}: {
  events: CalendarEvent[];
  onAdd: () => void;
}) => {
  // Hardcoded for "Selasa, 2 Dec" as per demo
  const currentDateStr = "2025-12-02";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-[#317C74]">Selasa</h2>
        <div className="text-3xl font-bold text-neutral">2</div>
      </div>

      <div className="relative">
        {HOURS.map((hour) => {
          const hourInt = parseInt(hour.split(":")[0]);
          const eventsInSlot = events.filter(
            (e) =>
              e.start_date === currentDateStr &&
              parseInt(e.start_time.split(":")[0]) === hourInt
          );

          return (
            <div
              key={hour}
              className="grid grid-cols-1 md:grid-cols-[100px_1fr] min-h-[100px] border-b border-slate-100 border-dashed group"
            >
              <div className="p-4 text-sm text-slate-500 font-medium border-r border-slate-100">
                {hour}
              </div>
              <div className="p-2 relative bg-white group-hover:bg-slate-50/30 transition-colors">
                {eventsInSlot.length > 0 ? (
                  eventsInSlot.map((evt) => (
                    <div
                      key={evt.id}
                      className={cn(
                        getEventColor(evt.color_theme, "day"),
                        "max-w-md mb-2"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm md:text-base">
                            {evt.title}
                          </p>
                          <p className="text-xs md:text-sm opacity-90">
                            {evt.start_time} - {evt.end_time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onAdd}
                      className="text-[#317C74] gap-2"
                    >
                      <Plus className="w-4 h-4" /> Tambah Agenda
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function CalendarPage() {
  const [view, setView] = React.useState<ViewMode>("month");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);

  const fetchEvents = async () => {
    const data = await getEvents("2025-11-25", "2026-01-10");
    setEvents(data);
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col h-full space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral">December 2025</h1>
          <p className="text-slate-500">Tahun Ajaran 2025/2026</p>
        </div>

        <div className="bg-slate-100 p-1 rounded-lg flex items-center self-start md:self-auto">
          {(["month", "week", "day"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                view === v
                  ? "bg-[#317C74] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {v === "month" ? "Bulan" : v === "week" ? "Minggu" : "Hari"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="bg-white border text-slate-500 rounded-md flex items-center shadow-sm">
            <button className="p-2 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-200"></div>
            <button className="px-3 text-sm font-medium hover:bg-slate-50">
              Hari Ini
            </button>
            <div className="w-[1px] h-4 bg-slate-200"></div>
            <button className="p-2 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button
            className="bg-[#317C74] hover:bg-[#2A6B63] text-white gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            Tambah Agenda <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {view === "month" && <MonthView events={events} />}
      {view === "week" && <WeekView events={events} />}
      {view === "day" && (
        <DayView events={events} onAdd={() => setIsModalOpen(true)} />
      )}

      <AddAgendaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchEvents()}
      />
    </div>
  );
}
