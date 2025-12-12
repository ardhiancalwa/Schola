import { User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white/50 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-neutral">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 border border-yellow-200 overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&backgroundColor=transparent`}
              alt="User"
            />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-neutral">Sara Wijaya</p>
            <p className="text-xs text-slate-500">Guru</p>
          </div>
        </div>
      </div>
    </header>
  );
}
