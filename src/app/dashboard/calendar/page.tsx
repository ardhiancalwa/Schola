"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Data & Configuration ---

type ViewMode = "month" | "week" | "day";

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

const DAYS_HEADER = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const WEEK_DATES = [
  { day: "Minggu", date: 30 },
  { day: "Senin", date: 1 },
  { day: "Selasa", date: 2 },
  { day: "Rabu", date: 3 },
  { day: "Kamis", date: 4 },
  { day: "Jumat", date: 5 },
  { day: "Sabtu", date: 6 },
];

// Grid for December 2025 (Month View)
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

type EventVariant =
  | "class-yellow"
  | "class-teal"
  | "meeting"
  | "holiday-red"
  | "holiday-pink";

type CalendarEvent = {
  id: string;
  title: string;
  timeStr: string;
  startHour: number; // For week/day view placement
  duration: number; // In hours
  dateStr: string; // For month view matching
  dayOfWeek: number; // 0=Sun, 1=Mon, etc.
  variant: EventVariant;
};

// Hardcoded Events
const EVENTS: CalendarEvent[] = [
  // Recurring Weekly
  {
    id: "e1",
    title: "Matematika - XI A",
    timeStr: "08:00 - 10:00 WIB",
    startHour: 8,
    duration: 2,
    dateStr: "2025-12-02",
    dayOfWeek: 2,
    variant: "class-yellow",
  },
  {
    id: "e2",
    title: "Matematika - XI C",
    timeStr: "13:00 - 15:00 WIB",
    startHour: 13,
    duration: 2,
    dateStr: "2025-12-02",
    dayOfWeek: 2,
    variant: "class-teal",
  },

  {
    id: "e3",
    title: "Matematika - XI B",
    timeStr: "08:00 - 10:00 WIB",
    startHour: 8,
    duration: 2,
    dateStr: "2025-12-04",
    dayOfWeek: 4,
    variant: "class-yellow",
  },
  {
    id: "e4",
    title: "Matematika - XII A",
    timeStr: "11:00 - 13:00 WIB",
    startHour: 11,
    duration: 2,
    dateStr: "2025-12-04",
    dayOfWeek: 4,
    variant: "meeting",
  },

  // Holidays
  {
    id: "h1",
    title: "Hari Raya Natal",
    timeStr: "",
    startHour: 0,
    duration: 0,
    dateStr: "2025-12-25",
    dayOfWeek: 4,
    variant: "holiday-red",
  },
  {
    id: "h2",
    title: "Cuti Bersama",
    timeStr: "",
    startHour: 0,
    duration: 0,
    dateStr: "2025-12-26",
    dayOfWeek: 5,
    variant: "holiday-pink",
  },
  {
    id: "h3",
    title: "Hari Raya Natal",
    timeStr: "",
    startHour: 0,
    duration: 0,
    dateStr: "2026-01-01",
    dayOfWeek: 4,
    variant: "holiday-pink",
  },

  // Special for Demo Day View (assume selected is Tue 2nd)
  // Re-list them for easier lookup or just filter
  {
    id: "d1",
    title: "Matematika - XI A",
    timeStr: "08:00 - 10:00",
    startHour: 8,
    duration: 2,
    dateStr: "demo-day",
    dayOfWeek: -1,
    variant: "class-yellow",
  },
  {
    id: "d2",
    title: "Matematika - XI C",
    timeStr: "13:00 - 15:00",
    startHour: 13,
    duration: 2,
    dateStr: "demo-day",
    dayOfWeek: -1,
    variant: "class-teal",
  },
];

const getEventStyles = (variant: EventVariant, view: ViewMode) => {
  const base =
    "rounded-md border-l-4 shadow-sm text-xs font-semibold overflow-hidden transition-all cursor-pointer hover:shadow-md";

  if (view === "month") {
    switch (variant) {
      case "class-yellow":
        return `${base} bg-[#FFF9E6] border-yellow-400 text-neutral py-1.5 px-2`;
      case "class-teal":
        return `${base} bg-[#F0FDF9] border-teal-400 text-neutral py-1.5 px-2`;
      case "meeting":
        return `${base} bg-[#F3E8FF] border-purple-500 text-neutral py-1.5 px-2`;
      case "holiday-red":
        return `${base} bg-red-100 border-red-500 text-red-700 py-2 px-2`;
      case "holiday-pink":
        return `${base} bg-pink-100 border-pink-400 text-pink-700 py-2 px-2`;
      default:
        return `${base} bg-slate-100`;
    }
  } else {
    // Week/Day View - Bigger Blocks
    switch (variant) {
      case "class-yellow":
        return `${base} bg-[#FFF9E6] border-yellow-400 text-neutral h-full w-full p-2`;
      case "class-teal":
        return `${base} bg-[#F0FDF9] border-teal-400 text-neutral h-full w-full p-2`;
      case "meeting":
        return `${base} bg-[#F3E8FF] border-purple-500 text-neutral h-full w-full p-2`;
      // Holidays usually don't appear in timeline hourly slots in the same way, but handled for consistency
      default:
        return `${base} bg-slate-100`;
    }
  }
};

// --- Components ---

const MonthView = ({ onSelectDate }: { onSelectDate: (d: string) => void }) => {
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
          const cellEvents = EVENTS.filter((e) => e.dateStr === cell.dateStr);

          // Hardcode recurring visual logic for month view simplicity in demo
          let displayEvents = cellEvents;
          if (displayEvents.length === 0) {
            const date = new Date(cell.dateStr);
            const day = date.getDay();
            // Match week events if no specific event overrides
            const recurring = EVENTS.filter(
              (e) =>
                e.dayOfWeek === day &&
                e.dateStr !== "demo-day" &&
                !e.id.startsWith("h")
            );
            if (
              recurring.length > 0 &&
              !cellEvents.some((e) => e.id.startsWith("h"))
            ) {
              // Only if not holiday
              if (
                !["2025-12-25", "2025-12-26", "2026-01-01"].includes(
                  cell.dateStr
                )
              ) {
                displayEvents = recurring;
              }
            }
          }

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
                    cell.dateStr === "2025-12-02"
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
                {displayEvents.map((evt, i) => (
                  <div key={i} className={getEventStyles(evt.variant, "month")}>
                    <p className="font-bold truncate">{evt.title}</p>
                    {evt.timeStr && (
                      <p className="opacity-80 text-[10px] truncate">
                        {evt.timeStr}
                      </p>
                    )}
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

const WeekView = () => {
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
        {HOURS.map((hour, i) => {
          const hourInt = parseInt(hour.split(":")[0]);
          return (
            <div
              key={hour}
              className="grid grid-cols-8 min-h-[80px] border-b border-slate-100 border-dashed"
            >
              {/* Time Column */}
              <div className="text-xs text-slate-400 font-medium p-2 text-center -mt-2.5 bg-white z-10">
                {hour}
              </div>

              {/* Day Columns */}
              {Array.from({ length: 7 }).map((_, colIdx) => {
                // Find event for this slot
                // colIdx 0 = Sunday (WEEK_DATES[0])
                // WEEK_DATES[0] day is Minggu (0)
                const dayOfWeek = colIdx; // 0=Sun
                const eventsInSlot = EVENTS.filter(
                  (e) => e.dayOfWeek === dayOfWeek && e.startHour === hourInt
                );

                return (
                  <div
                    key={colIdx}
                    className="border-l border-slate-100 p-1 relative hover:bg-slate-50/30 transition-colors"
                  >
                    {eventsInSlot.map((evt, evtIdx) => (
                      <div
                        key={evtIdx}
                        className={getEventStyles(evt.variant, "week")}
                        style={{ height: `${evt.duration * 80 - 8}px` }}
                      >
                        <p className="font-bold text-xs leading-tight mb-1">
                          {evt.title}
                        </p>
                        <p className="text-[10px] opacity-80">{evt.timeStr}</p>
                      </div>
                    ))}
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

const DayView = () => {
  // Simulating "Selasa, 2 Dec"
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-[#317C74]">Selasa</h2>
        <div className="text-3xl font-bold text-neutral">2</div>
      </div>

      <div className="relative">
        {HOURS.map((hour) => {
          const hourInt = parseInt(hour.split(":")[0]);
          const eventsInSlot = EVENTS.filter(
            (e) => e.dateStr === "demo-day" && e.startHour === hourInt
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
                  eventsInSlot.map((evt, i) => (
                    <div
                      key={i}
                      className={cn(
                        getEventStyles(evt.variant, "day"),
                        "max-w-md"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm md:text-base">
                            {evt.title}
                          </p>
                          <p className="text-xs md:text-sm opacity-90">
                            {evt.timeStr}
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

  return (
    <div className="flex flex-col h-full space-y-6 pb-10">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral">December 2025</h1>
          <p className="text-slate-500">Tahun Ajaran 2025/2026</p>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-100 p-1 rounded-lg flex items-center self-start md:self-auto">
          <button
            onClick={() => setView("month")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              view === "month"
                ? "bg-[#317C74] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Bulan
          </button>
          <button
            onClick={() => setView("week")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              view === "week"
                ? "bg-[#317C74] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Minggu
          </button>
          <button
            onClick={() => setView("day")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              view === "day"
                ? "bg-[#317C74] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Hari
          </button>
        </div>

        {/* Right Controls */}
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
          <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white gap-2">
            Tambah Agenda <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* --- Views --- */}
      {view === "month" && <MonthView onSelectDate={() => {}} />}
      {view === "week" && <WeekView />}
      {view === "day" && <DayView />}
    </div>
  );
}
