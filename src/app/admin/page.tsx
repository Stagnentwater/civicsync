"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface DashboardData {
  stats: {
    totalUsers: number;
    totalComplaints: number;
    openComplaints: number;
    inProgressComplaints: number;
    resolvedComplaints: number;
    totalBills: number;
    paidBills: number;
    pendingBills: number;
    totalPayments: number;
  };
  recentComplaints: Array<{
    id: string; department: string; description: string; status: string;
    createdAt: string; user: { name: string; phone: string };
  }>;
  recentPayments: Array<{
    id: string; amount: number; status: string; createdAt: string;
    bill: { user: { name: string; phone: string } };
  }>;
}

export default function AdminDashboard() {
  const { dict } = useApp();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) setData(await res.json());
    } catch { console.error("Failed to fetch admin dashboard"); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;
  if (!data) return <div className="text-center py-12 text-red-500 text-sm">{dict.common.error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">{dict.admin.dashboard}</h1>
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>{dict.common.back}</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <StatCard title={dict.admin.totalUsers} value={data.stats.totalUsers} icon="👥" color="blue" />
        <StatCard title={dict.admin.totalComplaints} value={data.stats.totalComplaints} icon="📋" color="purple" />
        <StatCard title={dict.admin.openComplaints} value={data.stats.openComplaints} icon="🔓" color="yellow" />
        <StatCard title={dict.admin.resolvedComplaints} value={data.stats.resolvedComplaints} icon="✅" color="green" />
        <StatCard title={dict.admin.totalPayments} value={data.stats.totalPayments} icon="💰" color="blue" />
        <StatCard title={dict.admin.paidBills} value={data.stats.paidBills} icon="✔️" color="green" />
        <StatCard title={dict.admin.pendingBills} value={data.stats.pendingBills} icon="⏳" color="orange" />
        <StatCard title="In Progress" value={data.stats.inProgressComplaints} icon="🔄" color="yellow" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        <Card onClick={() => router.push("/admin/complaints")} role="link" ariaLabel={dict.admin.allComplaints}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-sm font-medium text-zinc-900">{dict.admin.allComplaints}</h2>
              <p className="text-xs text-zinc-500">View and manage complaints</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => router.push("/admin/payments")} role="link" ariaLabel={dict.admin.paymentLogs}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <h2 className="text-sm font-medium text-zinc-900">{dict.admin.paymentLogs}</h2>
              <p className="text-xs text-zinc-500">View payment transactions</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-zinc-700 mb-3">{dict.admin.recentComplaints}</h2>
        {data.recentComplaints.length === 0 ? (
          <p className="text-xs text-zinc-400">{dict.common.noData}</p>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.name}</th>
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.department}</th>
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.status}</th>
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.date}</th>
              </tr></thead>
              <tbody>
                {data.recentComplaints.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                    <td className="px-3 py-2 text-zinc-700">{c.user.name}</td>
                    <td className="px-3 py-2 text-zinc-700">{c.department}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        c.status === "OPEN" ? "bg-blue-50 text-blue-700" :
                        c.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" :
                        "bg-emerald-50 text-emerald-700"
                      }`}>{c.status.replace("_", " ")}</span>
                    </td>
                    <td className="px-3 py-2 text-zinc-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-700 mb-3">{dict.admin.recentPayments}</h2>
        {data.recentPayments.length === 0 ? (
          <p className="text-xs text-zinc-400">{dict.common.noData}</p>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.name}</th>
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.amount}</th>
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.status}</th>
                <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.date}</th>
              </tr></thead>
              <tbody>
                {data.recentPayments.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                    <td className="px-3 py-2 text-zinc-700">{p.bill.user.name}</td>
                    <td className="px-3 py-2 font-medium text-zinc-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">{p.status}</span>
                    </td>
                    <td className="px-3 py-2 text-zinc-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
