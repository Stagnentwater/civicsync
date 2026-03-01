"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  serviceType: string;
  quantity: number;
  amount: number;
  address: string;
  locality: string;
  status: string;
  paymentId: string;
  createdAt: string;
}

const SERVICE_LABELS: Record<string, string> = {
  GAS_CYLINDER: "Gas Cylinder",
  WATER_TANKER: "Water Tanker",
  NEW_WATER_CONNECTION: "New Water Connection",
  NEW_GAS_CONNECTION: "New Gas Connection",
};

const SERVICE_ICONS: Record<string, string> = {
  GAS_CYLINDER: "🔥",
  WATER_TANKER: "💧",
  NEW_WATER_CONNECTION: "🚰",
  NEW_GAS_CONNECTION: "⛽",
};

export default function ServicesPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (res.ok) setBookings(data.bookings);
    } catch { console.error("Failed"); }
    finally { setLoading(false); }
  };

  const services = [
    { key: "GAS_CYLINDER", label: "Buy Gas Cylinder", desc: "Book LPG cylinder delivery", icon: "🔥", price: "₹950/unit", href: "/dashboard/services/gas" },
    { key: "WATER_TANKER", label: "Buy Water Tanker", desc: "Order water tanker", icon: "💧", price: "₹600/tanker", href: "/dashboard/services/water" },
    { key: "NEW_WATER_CONNECTION", label: "New Water Connection", desc: "Apply for municipal water", icon: "🚰", price: "₹3,500", href: "/dashboard/services/new-connection?type=water" },
    { key: "NEW_GAS_CONNECTION", label: "New Gas Connection", desc: "Apply for piped gas", icon: "⛽", price: "₹2,800", href: "/dashboard/services/new-connection?type=gas" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Services</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Book utilities & new connections</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>← {dict.common.back}</Button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {services.map((s) => (
          <Card key={s.key} onClick={() => router.push(s.href)} role="link" ariaLabel={s.label}>
            <div className="text-center">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-sm font-medium text-zinc-900 mt-1.5">{s.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
              <p className="text-xs font-medium text-zinc-600 mt-1">{s.price}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <div>
        <h2 className="text-sm font-medium text-zinc-700 mb-3">Your Bookings</h2>
        {loading ? <LoadingSpinner text={dict.common.loading} /> :
        bookings.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
            <p className="text-sm text-zinc-400">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-zinc-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{SERVICE_ICONS[b.serviceType] || "📦"}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-900">{SERVICE_LABELS[b.serviceType]}</p>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-xs text-zinc-400">{new Date(b.createdAt).toLocaleDateString()} • Qty: {b.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">₹{b.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
