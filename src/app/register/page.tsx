"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import authImage from "../../../public/assets/images/auth.svg";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signup(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Pendaftaran berhasil! Silakan periksa email Anda.");
        router.push(`/verify?email=${encodeURIComponent(data.email)}`);
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Column - Brand Section */}
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
            Daftar untuk mengakses dashboard pembelajaran dan memantau progres
            setiap siswa.
          </p>

          {/* Illustration Placeholder */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center">
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
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[450px] space-y-8 my-auto">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-neutral">
              Daftar Akun Baru
            </h2>
            <p className="text-slate-500 text-sm">
              Daftar sekarang untuk mulai menggunakan layanan kami dengan lebih
              mudah sejak hari pertama.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-neutral"
                htmlFor="fullName"
              >
                Nama Lengkap
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                className={`h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] ${
                  errors.fullName ? "border-red-500" : ""
                }`}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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
                className={`h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] ${
                  errors.email ? "border-red-500" : ""
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
                  className={`h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] pr-10 ${
                    errors.password ? "border-red-500" : ""
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
            </div>

            <div className="space-y-2">
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
                  placeholder="Masukkan ulang kata sandi Anda"
                  className={`h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  {...register("confirmPassword")}
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
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#317C74] hover:bg-[#2A6B63] text-white text-base font-bold rounded-lg transition-all mt-4"
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500">
            Sudah Memiliki Akun?{" "}
            <Link href="/" className="font-bold text-[#317C74] hover:underline">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
