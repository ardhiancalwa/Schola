"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import authImage from "../../public/assets/images/auth.svg";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi diperlukan"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await login(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        // Redirect is handled in server action
        toast.success("Login berhasil!");
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Column - Hero Section */}
      <div className="hidden lg:flex w-1/2 bg-[#317C74] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Schola</span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Kelola Kelas dan Perkembangan Siswa dengan Mudah.
          </h1>
          <p className="text-teal-100 text-lg mb-12">
            Masuk untuk mengakses dashboard pembelajaran dan memantau progres
            setiap siswa.
          </p>

          {/* Illustration Placeholder */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden  flex items-center justify-center">
            <Image
              src={authImage}
              alt="Teacher Illustration"
              className="object-contain w-full h-full opacity-90 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Bottom padding/decoration */}
        <div className="text-teal-200/60 text-sm">
          &copy; 2025 Schola Education Platform
        </div>
      </div>

      {/* Right Column - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-neutral">Selamat Datang!</h2>
            <p className="text-slate-500">
              Akses data belajar dan perkembangan kelas Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-neutral"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                className={`h-12 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-neutral"
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  className={`h-12 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] pr-10 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-slate-400 hover:text-[#317C74]"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#317C74] hover:bg-[#2A6B63] text-white text-base font-bold rounded-lg transition-all"
              disabled={isPending}
            >
              {isPending ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="font-bold text-neutral hover:underline"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
