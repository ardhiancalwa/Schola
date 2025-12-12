"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import loginImage from "../../../public/assets/images/auth.svg";
import logo from "../../../public/assets/images/logo.png";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Column - Brand Section (Identical to Login) */}
      <div className="hidden lg:flex w-1/2 bg-[#317C74] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" />
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
            {/* 
                    In a real app, use the specific illustration asset. 
                    Using a placeholder concept here as requested.
                 */}
            <Image
              src={loginImage}
              alt="Teacher Illustration"
              fill // Menggantikan w-full h-full, otomatis isi container parent
              className="object-contain opacity-90 hover:scale-105 transition-transform duration-500"
              priority // Wajib jika ini gambar utama (hero) biar loading instan
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimasi ukuran
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-neutral"
                htmlFor="name"
              >
                Nama Lengkap
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                className="h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74]"
                required
              />
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
                className="h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74]"
                required
              />
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
                  className="h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] pr-10"
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

            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-neutral"
                htmlFor="confirm-password"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Masukkan ulang kata sandi Anda"
                  className="h-11 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] pr-10"
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
              className="w-full h-12 bg-[#317C74] hover:bg-[#2A6B63] text-white text-base font-bold rounded-lg transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar"}
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
