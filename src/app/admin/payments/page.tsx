"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Payment {
  id: string; amount: number; status: string; createdAt: string;
  bill: { user: { name: string; phone: string } };
}

export default function AdminPaymentsPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) { const data = await res.json(); setPayments(data.payments); }
    } catch { console.error("Failed"); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">{dict.admin.paymentLogs}</h1>
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>{dict.common.back}</Button>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
          <p className="text-sm text-zinc-400">{dict.common.noData}</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-3 py-2 text-xs font-medium text-zinc-500">#</th>
              <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.name}</th>
              <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.phone}</th>
              <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.amount}</th>
              <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.status}</th>
              <th className="px-3 py-2 text-xs font-medium text-zinc-500">{dict.common.date}</th>
            </tr></thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                  <td className="px-3 py-2 text-zinc-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2 text-zinc-700">{p.bill.user.name}</td>
                  <td className="px-3 py-2 text-zinc-500 text-xs">{p.bill.user.phone}</td>
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
  );
}
