"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useTransition, Suspense } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { verifyOtp, resendOtp } from "@/lib/actions/auth";
import { toast } from "sonner";

// Updated to 8 digits as per user requirement
const OTP_LENGTH = 8;

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Dynamic OTP length
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Timer State
  const [timer, setTimer] = useState(0);
  const [isResending, startResendTransition] = useTransition();

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last character if multiple are entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace navigation
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If empty and pressing backspace, move to prev and clear it
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, OTP_LENGTH)
      .split("");
    if (pastedData.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (i < OTP_LENGTH) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  const handleVerify = () => {
    if (!email) {
      toast.error("Email tidak ditemukan. Silakan daftar ulang.");
      return;
    }

    startTransition(async () => {
      const code = otp.join("");
      if (code.length !== OTP_LENGTH) {
        toast.warning("Silakan lengkapi kode OTP.");
        return;
      }

      const result = await verifyOtp(email, code);
      if (result?.error) {
        toast.error(result.error);
      } else {
        // Redirect handled in server action
        toast.success("Verifikasi berhasil!");
      }
    });
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Email tidak ditemukan.");
      return;
    }

    startResendTransition(async () => {
      const result = await resendOtp(email);
      if (result.success) {
        toast.success("Kode OTP baru telah dikirim.");
        setTimer(60); // Start 60s cooldown
      } else {
        // Show specific error from server
        toast.error(result.error || "Gagal mengirim ulang OTP.");
      }
    });
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white font-sans p-4">
      <div className="w-full max-w-[550px] flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 relative">
          <Send
            className="w-16 h-16 text-[#317C74] -rotate-12"
            strokeWidth={1.5}
          />
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-neutral mb-3">
          Masukkan Kode OTP
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Kode 8 digit verifikasi telah dikirim ke alamat email{" "}
          <strong>{email}</strong>. Masukkan kode tersebut untuk mengaktifkan
          akun.
        </p>

        {/* OTP Input Row */}
        <div className="flex gap-2 justify-center w-full max-w-full flex-wrap sm:flex-nowrap mb-8 px-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                "text-center font-semibold rounded-lg sm:rounded-xl transition-all p-0",
                "border-slate-300 focus:border-[#317C74] focus:ring-[#317C74]",
                // Responsive sizing for 8 digits
                "w-8 h-10 text-lg", // Mobile: Narrower, shorter
                "sm:w-12 sm:h-14 sm:text-2xl", // Tablet/Desktop: Larger
                digit
                  ? "border-[#317C74] bg-[#F0FDF9] text-[#317C74]"
                  : "bg-white text-neutral"
              )}
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          className="w-full h-12 bg-[#317C74] hover:bg-[#2A6B63] text-white text-base font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 max-w-[400px]"
          disabled={isPending || !isComplete}
        >
          {isPending ? "Memverifikasi..." : "Verifikasi"}
        </Button>

        {/* Footer with Resend Logic */}
        <div className="mt-8 text-sm text-slate-500">
          Tidak Menerima Kode OTP?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || isResending}
            className="font-bold text-[#317C74] hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed transition-colors"
          >
            {timer > 0
              ? `Kirim ulang (${timer}s)`
              : isResending
              ? "Mengirim..."
              : "Kirim ulang"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
