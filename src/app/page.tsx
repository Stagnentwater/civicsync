"use client";

import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { dict, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const features = [
    { icon: "💳", title: "Pay Bills", desc: "Electricity, water, gas & property tax" },
    { icon: "🔧", title: "Book Services", desc: "New connections, cylinder booking & more" },
    { icon: "📋", title: "File Complaints", desc: "Report civic issues with location" },
    { icon: "📊", title: "Track Status", desc: "Real-time updates on your requests" },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12 max-w-lg">
        <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-lg font-bold">CS</span>
        </div>
        <h1 className="text-3xl font-semibold text-zinc-900 mb-3 tracking-tight">
          {dict.common.appName}
        </h1>
        <p className="text-zinc-500 text-base">
          {dict.common.tagline}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full mb-10">
        {features.map((f) => (
          <div key={f.title} className="bg-white border border-zinc-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-sm font-medium text-zinc-800">{f.title}</p>
            <p className="text-xs text-zinc-400 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <Button size="lg" onClick={() => router.push("/login")} aria-label={dict.common.login}>
        Get Started →
      </Button>
    </div>
  );
}
