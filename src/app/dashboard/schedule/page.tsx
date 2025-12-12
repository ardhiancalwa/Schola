import { supabase } from "@/lib/supabase"
import ScheduleCard from "@/components/dashboard/schedule-card"

export const revalidate = 0

export default async function SchedulePage() {
  const { data: schedules, error } = await supabase
    .from('schedules')
    .select(`
      *,
      classes (
        name,
        learning_style
      )
    `)
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching schedules:', error)
    return <div>Error loading schedule.</div>
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold tracking-tight text-slate-900">
           Jadwal Mengajar Hari Ini
         </h1>
         <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
         </p>
       </div>

       {(!schedules || schedules.length === 0) ? (
         <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">Tidak ada jadwal mengajar hari ini.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {schedules.map((schedule: any) => (
             <ScheduleCard 
               key={schedule.id} 
               schedule={schedule} 
             />
           ))}
         </div>
       )}
    </div>
  )
}
