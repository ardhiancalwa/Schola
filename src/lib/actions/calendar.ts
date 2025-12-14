"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CalendarEvent {
  id: string;
  title: string;
  start_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  color_theme: string;
}

export async function getEvents(start_date_gte: string, start_date_lte: string): Promise<CalendarEvent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("start_date", start_date_gte)
    .lte("start_date", start_date_lte);

  if (error || !data) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data as CalendarEvent[];
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const color = formData.get("color") as string;

  const { error } = await supabase.from("calendar_events").insert({
    title,
    start_date: date,
    start_time: startTime,
    end_time: endTime,
    color_theme: color,
  });

  if (error) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/calendar");
  return { success: true };
}
