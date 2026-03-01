"use client";

import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { dict, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl font-bold">CS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {dict.common.appName}
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          {dict.common.tagline}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mb-12">
        <Card className="text-center" ariaLabel="Pay bills feature">
          <div className="text-4xl mb-3" aria-hidden="true">💳</div>
          <h2 className="font-bold text-lg text-gray-800">{dict.common.viewBills}</h2>
          <p className="text-sm text-gray-500 mt-1">Pay utility bills quickly</p>
        </Card>
        <Card className="text-center" ariaLabel="File complaints feature">
          <div className="text-4xl mb-3" aria-hidden="true">📋</div>
          <h2 className="font-bold text-lg text-gray-800">{dict.common.fileComplaint}</h2>
          <p className="text-sm text-gray-500 mt-1">Report civic issues</p>
        </Card>
        <Card className="text-center" ariaLabel="Track status feature">
          <div className="text-4xl mb-3" aria-hidden="true">📊</div>
          <h2 className="font-bold text-lg text-gray-800">{dict.common.viewComplaints}</h2>
          <p className="text-sm text-gray-500 mt-1">Track complaint status</p>
        </Card>
      </div>

      <Button size="xl" onClick={() => router.push("/login")} aria-label={dict.common.login}>
        {dict.common.login} →
      </Button>
    </div>
  );
}
