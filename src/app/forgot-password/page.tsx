"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/actions/auth";
import { toast } from "sonner";
import Image from "next/image";
import forgotPasswordImage from "../../../public/assets/images/forgot-password.svg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await forgotPassword(email);
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsSent(true);
        toast.success("Tautan reset password berhasil dikirim!");
      }
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white font-sans p-4">
      <div className="w-full max-w-[500px] flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-8 relative w-[200px] h-[150px] flex items-center justify-center">
          <Image
            src={forgotPasswordImage}
            alt="Forgot Password Illustration"
            className="object-contain w-full h-full"
          />
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-neutral mb-3">
          Lupa Kata Sandi?
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
          Masukkan alamat email yang kamu gunakan saat mendaftar. Kami akan
          mengirimkan tautan untuk mengatur ulang kata sandi kamu.
        </p>

        {/* Form */}
        {!isSent ? (
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <Input
              type="email"
              placeholder="Masukkan Email Anda"
              className="h-12 border-slate-200 focus:border-[#317C74] focus:ring-[#317C74] rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full h-12 bg-[#317C74] hover:bg-[#2A6B63] text-white text-base font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
              disabled={isPending}
            >
              {isPending ? "Mengirim..." : "Kirim"}
            </Button>
          </form>
        ) : (
          <div className="w-full p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 mb-6">
            <p className="font-medium">Tautan berhasil dikirim!</p>
            <p className="text-sm mt-1">
              Silakan periksa kotak masuk email Anda.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-sm text-slate-500">
          Belum Menerima Email?{" "}
          <button
            type="button"
            onClick={() => setIsSent(false)}
            className="font-bold text-[#317C74] hover:underline"
          >
            Kirim ulang
          </button>
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 hover:text-slate-600"
          >
            &larr; Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
