import Link from "next/link"
import { Users } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const revalidate = 0

export default async function GradesPage() {
  const { data: classes, error } = await supabase
    .from('classes')
    .select('*')
    .order('name')

  if (error) {
    console.error("Error fetching classes:", error)
    return <div>Error loading classes.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Input Nilai & Evaluasi
        </h1>
      </div>

      {(!classes || classes.length === 0) ? (
        <div className="text-center py-12 text-slate-500">
          Belum ada kelas yang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((c: any) => (
            <Link key={c.id} href={`/dashboard/grades/${c.id}`} className="block group">
              <Card className="hover:border-indigo-500 transition-colors h-full">
                <CardHeader>
                  <CardTitle className="group-hover:text-indigo-600 transition-colors">
                    {c.name}
                  </CardTitle>
                  <CardDescription>
                    Learning Style: {c.learning_style || 'General'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>Kelola Nilai &rarr;</span>
                    </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
