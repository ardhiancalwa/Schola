import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
const dates = [
  "", "", "", "", "", "", "1",
  "2", "3", "4", "5", "6", "7", "8"
]


export function CalendarWidget() {
  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold text-neutral">Desember 2025</CardTitle>
        <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 text-center gap-y-3">
            {days.map(d => (
                <div key={d} className="text-xs font-medium text-slate-400">{d}</div>
            ))}
            {dates.map((d, i) => (
                <div key={i} className={`text-sm h-8 w-8 flex items-center justify-center rounded-full mx-auto ${
                    d === '2' ? 'bg-primary text-white font-bold' : 
                    d === '' ? '' : 'text-slate-600 hover:bg-slate-50'
                }`}>
                    {d}
                </div>
            ))}
        </div>

        {/* Agenda */}
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral">Agenda Hari ini</h4>
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <p className="text-sm font-bold text-neutral">Matematika - XI A</p>
                <p className="text-xs text-slate-500">08:00 - 10:00 WIB</p>
            </div>

            <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                <p className="text-sm font-bold text-neutral">Biologi - XI C</p>
                <p className="text-xs text-slate-500">13:00 - 15:00 WIB</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
