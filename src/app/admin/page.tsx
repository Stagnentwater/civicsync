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
    id: string;
    department: string;
    description: string;
    status: string;
    createdAt: string;
    user: { name: string; phone: string };
  }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    bill: { user: { name: string; phone: string } };
  }>;
}

export default function AdminDashboard() {
  const { dict } = useApp();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      console.error("Failed to fetch admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;
  if (!data) return <div className="text-center py-12 text-red-500">{dict.common.error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{dict.admin.dashboard}</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          {dict.common.back}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title={dict.admin.totalUsers} value={data.stats.totalUsers} icon="👥" color="blue" />
        <StatCard title={dict.admin.totalComplaints} value={data.stats.totalComplaints} icon="📋" color="purple" />
        <StatCard title={dict.admin.openComplaints} value={data.stats.openComplaints} icon="🔓" color="yellow" />
        <StatCard title={dict.admin.resolvedComplaints} value={data.stats.resolvedComplaints} icon="✅" color="green" />
        <StatCard title={dict.admin.totalPayments} value={data.stats.totalPayments} icon="💰" color="blue" />
        <StatCard title={dict.admin.paidBills} value={data.stats.paidBills} icon="✔️" color="green" />
        <StatCard title={dict.admin.pendingBills} value={data.stats.pendingBills} icon="⏳" color="orange" />
        <StatCard title="In Progress" value={data.stats.inProgressComplaints} icon="🔄" color="yellow" />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card
          className="hover:translate-y-[-2px] border-l-4 border-l-blue-500"
          onClick={() => router.push("/admin/complaints")}
          role="link"
          ariaLabel={dict.admin.allComplaints}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl" aria-hidden="true">📋</span>
            <div>
              <h2 className="font-bold text-lg">{dict.admin.allComplaints}</h2>
              <p className="text-sm text-gray-500">View and manage all complaints</p>
            </div>
          </div>
        </Card>
        <Card
          className="hover:translate-y-[-2px] border-l-4 border-l-green-500"
          onClick={() => router.push("/admin/payments")}
          role="link"
          ariaLabel={dict.admin.paymentLogs}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl" aria-hidden="true">💳</span>
            <div>
              <h2 className="font-bold text-lg">{dict.admin.paymentLogs}</h2>
              <p className="text-sm text-gray-500">View all payment transactions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Complaints */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{dict.admin.recentComplaints}</h2>
        {data.recentComplaints.length === 0 ? (
          <Card><p className="text-gray-500">{dict.common.noData}</p></Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.name}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.department}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.status}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.date}</th>
                </tr>
              </thead>
              <tbody>
                {data.recentComplaints.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{c.user.name}</td>
                    <td className="px-4 py-3">{c.department}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        c.status === "OPEN" ? "bg-blue-100 text-blue-800" :
                        c.status === "IN_PROGRESS" ? "bg-orange-100 text-orange-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{dict.admin.recentPayments}</h2>
        {data.recentPayments.length === 0 ? (
          <Card><p className="text-gray-500">{dict.common.noData}</p></Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.name}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.amount}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.status}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600" scope="col">{dict.common.date}</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{p.bill.user.name}</td>
                    <td className="px-4 py-3 font-semibold">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
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
