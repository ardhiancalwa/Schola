import { supabase } from "@/lib/supabase"
import { GradeManager } from "@/components/grades/grade-manager"
import { ErrorAnalysisChart } from "@/components/dashboard/error-analysis-chart"

type Props = {
  params: Promise<{ classId: string }>
}

export default async function ClassGradesPage({ params }: Props) {
  const { classId } = await params
  
  // 1. Fetch Class Details
  const { data: classData } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single()

  if (!classData) {
     return <div>Class not found</div>
  }

  // 2. Fetch Students
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', classId)
    .order('name')

  // 3. Fetch Data for Analysis (Grades & Assessments)
  const { data: assessments } = await supabase
    .from('assessments')
    .select('id')
    .eq('class_id', classId)
  
  let allGrades: any[] = []
  if (assessments && assessments.length > 0) {
      const assessmentIds = assessments.map(a => a.id)
      const { data: gradesData } = await supabase
        .from('grades')
        .select('*, assessments(*)')
        .in('assessment_id', assessmentIds)
      
      if (gradesData) allGrades = gradesData
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-neutral font-sans">
             Input Nilai - {classData.name}
           </h1>
           <p className="text-slate-500 text-sm">Gaya Belajar: {classData.learning_style}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Left/Bottom on desktop: Grading Table */}
         <div className="order-2 lg:order-1">
             <GradeManager 
               students={students || []} 
               classId={classId} 
             />
         </div>
         
         {/* Right/Top on desktop: Analysis Chart */}
         <div className="order-1 lg:order-2 h-full min-h-[400px]">
             <ErrorAnalysisChart grades={allGrades} />
         </div>
      </div>
    </div>
  )
}
