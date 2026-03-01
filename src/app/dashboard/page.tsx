"use client";

import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { dict, user } = useApp();
  const router = useRouter();

  const services = [
    {
      title: dict.common.viewBills,
      description: "View and pay utility bills",
      icon: "💳",
      href: "/dashboard/bills",
    },
    {
      title: "Services",
      description: "Book gas, water & new connections",
      icon: "🔧",
      href: "/dashboard/services",
    },
    {
      title: dict.common.fileComplaint,
      description: "Report issues to civic departments",
      icon: "📋",
      href: "/dashboard/complaints/new",
    },
    {
      title: dict.common.viewComplaints,
      description: "Track your filed complaints",
      icon: "📊",
      href: "/dashboard/complaints",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900">
          {dict.common.welcome}, {user?.name || user?.phone || "Citizen"}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">{dict.common.tagline}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service) => (
          <Card
            key={service.href}
            onClick={() => router.push(service.href)}
            role="link"
            ariaLabel={service.title}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5" aria-hidden="true">{service.icon}</span>
              <div>
                <h2 className="text-sm font-medium text-zinc-900">{service.title}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{service.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {user?.role === "ADMIN" && (
        <div className="mt-4">
          <Card
            onClick={() => router.push("/admin")}
            role="link"
            ariaLabel={dict.common.admin}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">⚙️</span>
              <div>
                <h2 className="text-sm font-medium text-zinc-900">{dict.common.admin}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Manage complaints, view payments & analytics</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
