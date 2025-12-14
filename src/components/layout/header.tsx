import { createClient } from "@/lib/supabase/server";
import { User } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest";
  const role = user?.user_metadata?.role || "Guru";

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white/50 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-neutral">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 border border-yellow-200 overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=transparent`}
              alt="User"
            />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-neutral">{name}</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
