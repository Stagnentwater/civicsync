"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

type Step = "phone" | "otp";

export default function LoginPage() {
  const { dict, setUser } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }
      setStep("otp");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }
      setUser({
        userId: data.user.id,
        name: data.user.name,
        phone: data.user.phone,
        role: data.user.role,
      });
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" ariaLabel="Login form">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {dict.common.login}
          </h1>
          <p className="text-gray-500 mt-1">{dict.common.tagline}</p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {step === "phone" ? (
          <div className="space-y-4">
            <Input
              label={dict.common.phone}
              placeholder={dict.common.enterPhone}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
              aria-required="true"
            />
            <Input
              label={`${dict.common.name} (optional)`}
              placeholder={dict.common.enterName}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="pt-4">
              <Button
                fullWidth
                size="lg"
                onClick={handleSendOtp}
                loading={loading}
                disabled={phone.length < 10}
              >
                {dict.common.sendOtp}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
              OTP sent to <strong>{phone}</strong>
              <br />
              <span className="text-xs text-blue-500">
                (Use 123456 for demo)
              </span>
            </div>
            <Input
              label={dict.common.otp}
              placeholder={dict.common.enterOtp}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              autoFocus
              aria-required="true"
            />
            <div className="pt-4 space-y-3">
              <Button
                fullWidth
                size="lg"
                onClick={handleVerifyOtp}
                loading={loading}
                disabled={otp.length !== 6}
              >
                {dict.common.verifyOtp}
              </Button>
              <Button
                fullWidth
                size="md"
                variant="outline"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
              >
                {dict.common.back}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
