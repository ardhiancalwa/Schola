import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const students = [
  {
    name: "Reno Renaldi",
    subject: "Matematika",
    score: 65,
    max: 75,
    percentage: 86
  },
  {
    name: "Nisa Purba",
    subject: "Matematika",
    score: 65,
    max: 75,
    percentage: 86
  },
  {
    name: "Chintia",
    subject: "Matematika",
    score: 60,
    max: 75,
    percentage: 80
  },
  {
    name: "Jasmine K",
    subject: "Matematika",
    score: 60,
    max: 75,
    percentage: 80
  },
  {
    name: "Naila Nur",
    subject: "Matematika",
    score: 60,
    max: 75,
    percentage: 80
  },
]

export function StudentNeedHelp() {
  return (
    <Card className="border border-slate-100 shadow-sm h-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold text-neutral">Butuh Bimbingan</CardTitle>
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
            XI A
        </Badge>
      </CardHeader>
      <CardContent>
         <div className="flex items-center gap-4 text-sm font-medium text-slate-500 border-b border-slate-100 pb-2 mb-4">
            <span className="text-primary border-b-2 border-primary pb-2 -mb-2.5">Nilai Rendah</span>
            <span className="cursor-pointer hover:text-slate-700">Tugas Rendah</span>
         </div>

         <div className="space-y-4">
            {students.map((student, i) => (
                <div key={i} className="flex items-center gap-3">
                    {/* Avatar Placeholder */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                             <p className="text-sm font-semibold text-neutral truncate">{student.name}</p>
                             <p className="text-xs font-semibold text-neutral">{student.score}/{student.max}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-1.5">{student.subject}</p>
                        
                        {/* Custom Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-secondary rounded-full" style={{ width: `${student.percentage}%` }}></div>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </CardContent>
    </Card>
  )
}
