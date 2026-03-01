"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  bill: {
    user: { name: string; phone: string };
  };
}

export default function AdminPaymentsPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
      }
    } catch {
      console.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{dict.admin.paymentLogs}</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          {dict.common.back}
        </Button>
      </div>

      {payments.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">{dict.common.noData}</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-white rounded-2xl shadow-md" role="table">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600" scope="col">
                  #
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600" scope="col">
                  {dict.common.name}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600" scope="col">
                  {dict.common.phone}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600" scope="col">
                  {dict.common.amount}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600" scope="col">
                  {dict.common.status}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600" scope="col">
                  {dict.common.date}
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{payment.bill.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.bill.user.phone}</td>
                  <td className="px-6 py-4 font-semibold text-green-700">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
