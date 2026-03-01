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
      description: "View and pay your utility bills",
      icon: "💳",
      href: "/dashboard/bills",
      color: "border-l-4 border-l-blue-500",
    },
    {
      title: dict.common.fileComplaint,
      description: "Report issues to civic departments",
      icon: "📋",
      href: "/dashboard/complaints/new",
      color: "border-l-4 border-l-green-500",
    },
    {
      title: dict.common.viewComplaints,
      description: "Track your filed complaints",
      icon: "📊",
      href: "/dashboard/complaints",
      color: "border-l-4 border-l-purple-500",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {dict.common.welcome}, {user?.name || user?.phone || "Citizen"}!
        </h1>
        <p className="text-gray-500 mt-2">{dict.common.tagline}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card
            key={service.href}
            className={`${service.color} hover:translate-y-[-2px]`}
            onClick={() => router.push(service.href)}
            role="link"
            ariaLabel={service.title}
          >
            <div className="text-4xl mb-4" aria-hidden="true">
              {service.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {service.title}
            </h2>
            <p className="text-sm text-gray-500">{service.description}</p>
          </Card>
        ))}
      </div>

      {user?.role === "ADMIN" && (
        <div className="mt-8">
          <Card
            className="border-l-4 border-l-yellow-500 hover:translate-y-[-2px]"
            onClick={() => router.push("/admin")}
            role="link"
            ariaLabel={dict.common.admin}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl" aria-hidden="true">⚙️</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {dict.common.admin}
                </h2>
                <p className="text-sm text-gray-500">
                  Manage complaints, view payments, and system analytics
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
