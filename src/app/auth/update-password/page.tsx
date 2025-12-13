"use client";

import { useState, useTransition } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserPassword } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Kata sandi minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Kata sandi tidak cocok");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      const result = await updateUserPassword(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Kata sandi berhasil diperbarui!");
        // Redirect handled in server action
      }
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white font-sans p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 relative bg-teal-50 p-4 rounded-full">
          <Lock className="w-10 h-10 text-[#317C74]" />
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-neutral mb-3">
          Atur Ulang Kata Sandi
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Masukkan kata sandi baru untuk akun Anda. Gunakan kombinasi yang kuat
          dan aman.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2 text-left">
            <label
              className="text-sm font-semibold text-neutral"
              htmlFor="password"
            >
              Kata Sandi Baru
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                className="h-12 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label
              className="text-sm font-semibold text-neutral"
              htmlFor="confirmPassword"
            >
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan ulang kata sandi"
                className="h-12 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#317C74] hover:bg-[#2A6B63] text-white text-base font-bold rounded-lg transition-all shadow-md hover:shadow-lg mt-6"
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
          </Button>
        </form>
      </div>
    </div>
  );
}
