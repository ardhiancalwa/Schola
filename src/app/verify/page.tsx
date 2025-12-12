"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last character if multiple are entered (though maxLength helps)
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 3) {
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
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("");
    if (pastedData.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (i < 4) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/dashboard");
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white font-sans p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center text-center">
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
          Kode verifikasi telah dikirim ke alamat email kamu. Masukkan kode
          tersebut untuk mengaktifkan akun.
        </p>

        {/* OTP Input Row */}
        <div className="flex gap-4 mb-8">
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
                "w-14 h-14 text-center text-2xl font-semibold rounded-full transition-all",
                "border-slate-300 focus:border-[#317C74] focus:ring-[#317C74]",
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
          className="w-full h-12 bg-[#317C74] hover:bg-[#2A6B63] text-white text-base font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          disabled={isLoading || !isComplete}
        >
          {isLoading ? "Memverifikasi..." : "Verifikasi"}
        </Button>

        {/* Footer */}
        <div className="mt-8 text-sm text-slate-500">
          Tidak Menerima Kode OTP?{" "}
          <button
            type="button"
            className="font-bold text-[#317C74] hover:underline"
          >
            Kirim ulang
          </button>
        </div>
      </div>
    </div>
  );
}
