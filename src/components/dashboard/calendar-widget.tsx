"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays, subDays, isSameDay, isToday } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { AddAgendaModal } from "@/components/calendar/add-agenda-modal";

interface CalendarWidgetProps {
  events: {
    id: string;
    title: string;
    start_date: string;
    start_time: string;
    end_time: string;
    color: string;
  }[];
}

export function CalendarWidget({ events = [] }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const router = useRouter();

  // Navigation Logic
  const handlePrevDay = () => setCurrentDate((prev) => subDays(prev, 1));
  const handleNextDay = () => setCurrentDate((prev) => addDays(prev, 1));
  const handleSuccess = () => router.refresh();

  // Week View Logic (Show 7 days surrounding current date)
  // Let's center it or just start of week? User asked for "navigate days".
  // Keeping previous logic: Start of week containing current date.
  const startOfCurrentWeek = new Date(currentDate);
  const day = startOfCurrentWeek.getDay();
  const diff = startOfCurrentWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  startOfCurrentWeek.setDate(diff);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfCurrentWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Filter Events for Displayed Day
  const filteredEvents = events.filter(
    (evt) => evt.start_date === format(currentDate, "yyyy-MM-dd")
  );

  const getEventStyles = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-50 border-yellow-100";
      case "green":
        return "bg-emerald-50 border-emerald-100";
      case "purple":
        return "bg-purple-50 border-purple-100";
      case "blue":
        return "bg-blue-50 border-blue-100";
      default:
        return "bg-slate-50 border-slate-100";
    }
  };

  return (
    <>
      <Card className="border border-slate-100 shadow-sm relative">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-bold text-neutral capitalize">
            {format(currentDate, "MMMM yyyy", { locale: localeId })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#317C74]"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <div className="flex gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={handlePrevDay}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextDay}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calendar Grid (Week View) */}
          <div className="grid grid-cols-7 text-center gap-y-3">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
              <div key={d} className="text-xs font-medium text-slate-400">
                {d}
              </div>
            ))}
            {weekDays.map((date, i) => {
              const isSelected = isSameDay(date, currentDate);
              const isTodayDate = isToday(date);
              return (
                <div
                  key={i}
                  onClick={() => setCurrentDate(date)}
                  className={cn(
                    "text-sm h-8 w-8 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-all",
                    isSelected
                      ? "bg-[#317C74] text-white font-bold shadow-md"
                      : isTodayDate
                      ? "bg-slate-100 text-[#317C74] font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>

          {/* Agenda */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral">
              Agenda{" "}
              {isToday(currentDate)
                ? "Hari ini"
                : format(currentDate, "dd MMM", { locale: localeId })}
            </h4>

            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-3 rounded-lg border ${getEventStyles(
                    evt.color
                  )}`}
                >
                  <p className="text-sm font-bold text-neutral">{evt.title}</p>
                  <p className="text-xs text-slate-500">
                    {evt.start_time.slice(0, 5)} - {evt.end_time.slice(0, 5)}{" "}
                    WIB
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Tidak ada agenda.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <AddAgendaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
