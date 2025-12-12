"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Definisikan tipe data biar aman
interface ScheduleCardProps {
  schedule: {
    id: string;
    subject: string;
    topic: string | null;
    start_time: string;
    end_time: string;
    classes: {
      name: string;
      learning_style: string | null;
    } | null;
  };
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  const [loading, setLoading] = useState(false);
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Format Jam (misal: 08:30)
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Logic panggil API AI
  const handleGenerateTips = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-tips", {
        method: "POST",
        body: JSON.stringify({
          topic: schedule.topic || schedule.subject,
          learningStyle: schedule.classes?.learning_style || "General",
        }),
      });
      const data = await res.json();
      setAiTips(data.data); // Simpan hasil AI ke state
    } catch (error) {
      console.error("AI Error:", error);
      setAiTips("Gagal mengambil saran AI. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card className="flex flex-col justify-between border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
            </span>
          </div>
          <h3 className="font-bold text-lg leading-none">{schedule.subject}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {schedule.topic || "Topik belum ditentukan"}
          </p>
        </CardHeader>
        
        <CardFooter className="pt-4 flex items-center justify-between border-t bg-slate-50/50">
          <div className="flex gap-2">
            {/* Badge Kelas */}
            <Badge variant="outline" className="bg-white">
              <GraduationCap className="w-3 h-3 mr-1" />
              {schedule.classes?.name || "Unknown Class"}
            </Badge>
            {/* Badge Gaya Belajar */}
            {schedule.classes?.learning_style && (
              <Badge variant="secondary" className="text-xs">
                {schedule.classes.learning_style}
              </Badge>
            )}
          </div>

          {/* Tombol Trigger Modal AI */}
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="default" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              onClick={handleGenerateTips}
            >
              {loading ? (
                "Thinking..." 
              ) : (
                <>
                  <Sparkles className="w-3 h-3" /> Tips
                </>
              )}
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      {/* Isi Modal AI */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Saran Mengajar AI
          </DialogTitle>
          <DialogDescription>
            Tips personalisasi untuk kelas <b>{schedule.classes?.name}</b> dengan gaya belajar <b>{schedule.classes?.learning_style}</b>.
          </DialogDescription>  
        </DialogHeader>
        
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
          {aiTips || "Sedang menyusun strategi mengajar terbaik..."}
        </div>
      </DialogContent>
    </Dialog>
  );
}