"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Bill {
  id: string;
  billType: string;
  label: string;
  amount: number;
  dueDate: string;
  status: string;
  payments: { id: string; status: string; createdAt: string }[];
}

interface PaymentReceipt {
  id: string;
  amount: number;
  billType: string;
  label: string;
}

export default function BillsPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/billing");
      const data = await res.json();
      if (res.ok) setBills(data.bills);
    } catch { setMessage({ type: "error", text: "Failed to load bills" }); }
    finally { setLoading(false); }
  };

  const handlePay = async (bill: Bill) => {
    setPayingId(bill.id); setMessage(null); setReceipt(null); setProcessingStep(1);
    await new Promise((r) => setTimeout(r, 800)); setProcessingStep(2);
    await new Promise((r) => setTimeout(r, 1200)); setProcessingStep(3);
    try {
      const res = await fetch("/api/billing/pay", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billId: bill.id }),
      });
      const data = await res.json();
      await new Promise((r) => setTimeout(r, 600));
      if (res.ok) {
        setProcessingStep(4);
        setMessage({ type: "success", text: dict.common.paymentSuccess });
        setReceipt({ id: data.payment.id, amount: data.payment.amount, billType: bill.billType, label: bill.label });
        fetchBills();
      } else { setMessage({ type: "error", text: data.error || dict.common.paymentFailed }); }
    } catch { setMessage({ type: "error", text: dict.common.paymentFailed }); }
    finally { setPayingId(null); setProcessingStep(0); }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{dict.common.bills}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{dict.common.viewBills}</p>
        </div>
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>\u2190 {dict.common.back}</Button>
      </div>

      {/* Payment Processing Overlay */}
      {payingId && processingStep > 0 && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-xs w-full text-center border border-zinc-200">
            <div className="text-3xl mb-3">
              {processingStep === 1 ? "\ud83d\udd0d" : processingStep === 2 ? "\ud83d\udcb3" : processingStep === 3 ? "\u2705" : "\ud83c\udf89"}
            </div>
            <p className="text-sm font-medium text-zinc-800 mb-3">
              {processingStep === 1 ? "Verifying..." : processingStep === 2 ? "Processing..." : processingStep === 3 ? "Confirming..." : "Done!"}
            </p>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 w-8 rounded-full ${processingStep >= s ? "bg-zinc-900" : "bg-zinc-200"}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt */}
      {receipt && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-emerald-800">\ud83e\uddc0 Payment Receipt</p>
            <button onClick={() => setReceipt(null)} className="text-xs text-zinc-500 hover:text-zinc-800">\u2715</button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <span className="text-zinc-500">ID:</span>
            <span className="font-mono text-zinc-700">{receipt.id.slice(0, 12)}</span>
            <span className="text-zinc-500">Type:</span>
            <span className="text-zinc-700">{receipt.billType}</span>
            <span className="text-zinc-500">Amount:</span>
            <span className="font-medium text-emerald-700">\u20b9{receipt.amount.toLocaleString()}</span>
            <span className="text-zinc-500">Status:</span>
            <span className="font-medium text-emerald-700">\u2713 SUCCESS</span>
          </div>
        </div>
      )}

      {message && (
        <div className={`mb-4 px-3 py-2 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`} role="alert">
          {message.text}
        </div>
      )}

      {bills.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
          <p className="text-zinc-400 text-sm">{dict.common.noData}</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Total", value: bills.length, color: "text-zinc-800" },
              { label: "Pending", value: bills.filter(b => b.status === "PENDING").length, color: "text-amber-600" },
              { label: "Paid", value: bills.filter(b => b.status === "PAID").length, color: "text-emerald-600" },
              { label: "Due", value: `\u20b9${bills.filter(b => b.status === "PENDING").reduce((s, b) => s + b.amount, 0).toLocaleString()}`, color: "text-red-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-zinc-200 rounded-lg p-3 text-center">
                <p className={`text-lg font-semibold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {bills.map((bill) => {
              const isOverdue = bill.status === "PENDING" && new Date(bill.dueDate) < new Date();
              return (
                <div key={bill.id} className={`bg-white border rounded-lg p-4 ${isOverdue ? "border-red-200" : "border-zinc-200"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-900 truncate">{bill.label}</p>
                        <StatusBadge status={bill.status} />
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Due {new Date(bill.dueDate).toLocaleDateString()}
                        {isOverdue && <span className="text-red-500 ml-1">\u2022 Overdue</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <p className="text-sm font-semibold text-zinc-900">\u20b9{bill.amount.toLocaleString()}</p>
                      {bill.status === "PENDING" && (
                        <Button size="sm" onClick={() => handlePay(bill)} loading={payingId === bill.id}>
                          Pay
                        </Button>
                      )}
                      {bill.status === "PAID" && bill.payments[0] && (
                        <span className="text-xs text-emerald-600">\u2713 {new Date(bill.payments[0].createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
